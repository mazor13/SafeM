#!/usr/bin/env node
const { KeyManagementServiceClient } = require('@google-cloud/kms');
const { execSync } = require('child_process');
const crypto = require('crypto');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('project', { type: 'string', demandOption: true })
  .option('keyRing', { type: 'string', demandOption: true })
  .option('key', { type: 'string', demandOption: true })
  .option('functionName', { type: 'string', demandOption: true })
  .option('bucketName', { type: 'string', demandOption: true }) // הוספנו את הפרמטר הזה
  .option('region', { type: 'string', default: 'us-central1' })
  .option('gcloudPath', { type: 'string', default: 'gcloud' })
  .help()
  .parse();

const kms = new KeyManagementServiceClient();

async function main() {
  // שולפים את bucketName מהארגומנטים
  const { project, keyRing, key, functionName, bucketName, region, gcloudPath: gcloud } = argv;
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
  const serviceName = functionName.toLowerCase(); 
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
    
    // כאן התיקון הגדול: אנחנו מעבירים את bucketName לסקריפט האימות
    execSync(`node scripts/verify_document.js --docId=${process.env.SMOKE_DOC_ID} --project=${project} --bucketName=${bucketName}`, { stdio: 'inherit', env: process.env });
    
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
