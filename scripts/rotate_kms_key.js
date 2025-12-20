#!/usr/bin/env node
/**
 * scripts/rotate_kms_key.js
 *
 * Automates KMS Key Rotation:
 * 1. Creates new cryptoKeyVersion
 * 2. Validates it (Sign/Verify test)
 * 3. Updates Cloud Function env var (KMS_KEY_NAME)
 * 4. Verifies system health
 * 5. Rollback on failure
 */
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { argv } = require('yargs')
  .option('project', { type: 'string', demandOption: true })
  .option('keyRing', { type: 'string', demandOption: true })
  .option('key', { type: 'string', demandOption: true })
  .option('functionName', { type: 'string', demandOption: true })
  .option('region', { type: 'string', default: 'us-central1' })
  .option('gcloudPath', { type: 'string', default: 'gcloud' })
  .help();

const kms = new KeyManagementServiceClient();

async function main() {
  const { project, keyRing, key, functionName, region, gcloudPath: gcloud } = argv;
  const parent = `projects/${project}/locations/${region}/keyRings/${keyRing}/cryptoKeys/${key}`;

  console.log(`🔄 Starting Rotation for ${functionName}...`);
  console.log(`Creating new version under ${parent}...`);
  
  const [version] = await kms.createCryptoKeyVersion({
    parent,
    cryptoKeyVersion: { template: { algorithm: 'RSA_SIGN_PKCS1_2048_SHA256' } }
  });
  const newVersionName = version.name;
  console.log(`✅ Created new version: ${newVersionName}`);

  // Test Sign/Verify
  console.log('🧪 Testing new key version...');
  const testPayload = Buffer.from('rotation-test-' + Date.now());
  const digest = crypto.createHash('sha256').update(testPayload).digest();

  // Wait a bit for key to be ready
  await new Promise(r => setTimeout(r, 2000));

  const [signResp] = await kms.asymmetricSign({
    name: newVersionName,
    digest: { sha256: digest }
  });

  const [pubResp] = await kms.getPublicKey({ name: newVersionName });
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(testPayload);
  verifier.end();
  
  if (!verifier.verify(pubResp.pem, Buffer.from(signResp.signature))) {
    throw new Error('❌ Local verification of new key failed!');
  }
  console.log('✅ New key verified successfully.');

  // Get Current Env
  console.log('🔍 Reading current config...');
  const serviceName = functionName.toLowerCase(); // Gen2 service name is usually lowercase
  let prevKms = '';
  
  try {
    const jsonOut = execSync(`${gcloud} run services describe ${serviceName} --region=${region} --format=json --project=${project}`, { encoding: 'utf8' });
    const parsed = JSON.parse(jsonOut);
    const envVars = parsed?.spec?.template?.spec?.containers?.[0]?.env || [];
    const kv = envVars.find(e => e.name === 'KMS_KEY_NAME');
    prevKms = kv ? kv.value : '';
  } catch (err) {
    console.warn('⚠️ Could not read previous config, rollback might be limited.');
  }

  // Update Function
  console.log(`🚀 Promoting new key to ${serviceName}...`);
  try {
    execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${newVersionName}" --project=${project} --quiet`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Update failed. No changes applied.');
    throw err;
  }

  // Verification
  console.log('🕵️‍♂️ Verifying system health...');
  try {
    // Wait for traffic shift
    await new Promise(r => setTimeout(r, 10000)); 
    execSync(`node scripts/verify_document.js --docId=${process.env.SMOKE_DOC_ID} --project=${project}`, { stdio: 'inherit', env: process.env });
    console.log('✅ Rotation Complete Success!');
  } catch (err) {
    console.error('❌ Post-update verification FAILED. Rolling back...');
    if (prevKms) {
      execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${prevKms}" --project=${project} --quiet`, { stdio: 'inherit' });
      console.log('✅ Rollback successful.');
    } else {
      console.error('🚨 Manual rollback required! Previous key was unknown.');
    }
    process.exit(1);
  }
}

main().catch(err => {
  console.error('🚨 Script failed:', err);
  process.exit(2);
});
