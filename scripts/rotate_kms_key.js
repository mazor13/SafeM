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
  .option('bucketName', { type: 'string', demandOption: true })
  .option('region', { type: 'string', default: 'us-central1' })
  .option('gcloudPath', { type: 'string', default: 'gcloud' })
  .help().parse();

// Initialize KMS client using ADC
const kms = new KeyManagementServiceClient();

async function main() {
  const { project, keyRing, key, functionName, bucketName, region, gcloudPath: gcloud } = argv;
  const parent = `projects/${project}/locations/${region}/keyRings/${keyRing}/cryptoKeys/${key}`;

  console.log(`🔄 Starting Key Rotation for ${functionName}...`);
  
  // 1. Create New Key Version
  const [version] = await kms.createCryptoKeyVersion({
    parent,
    cryptoKeyVersion: { template: { algorithm: 'RSA_SIGN_PKCS1_2048_SHA256' } }
  });
  console.log(`✅ Created new version: ${version.name.split('/').pop()}`);

  // 2. Local Verification (Quick Sanity Check)
  console.log('🧪 Performing local crypto test...');
  const testPayload = Buffer.from('sanity-check-' + Date.now());
  const digest = crypto.createHash('sha256').update(testPayload).digest();
  
  // Wait a bit for propagation
  await new Promise(r => setTimeout(r, 2000));

  const [signResp] = await kms.asymmetricSign({ name: version.name, digest: { sha256: digest } });
  const [pubResp] = await kms.getPublicKey({ name: version.name });
  
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(testPayload);
  if (!verifier.verify(pubResp.pem, Buffer.from(signResp.signature))) {
    throw new Error('Local verification failed: Signature mismatch');
  }
  console.log('✅ Local crypto test passed.');

  // 3. Update Cloud Run Service
  const serviceName = functionName.toLowerCase();
  let prevKms = '';
  
  // Try to save previous state for rollback
  try {
    const jsonOut = execSync(`${gcloud} run services describe ${serviceName} --region=${region} --format=json --project=${project}`, { encoding: 'utf8' });
    prevKms = JSON.parse(jsonOut)?.spec?.template?.spec?.containers?.[0]?.env?.find(e => e.name === 'KMS_KEY_NAME')?.value || '';
  } catch (e) { /* Ignore if service doesn't exist yet */ }

  console.log(`🚀 Updating Cloud Run service [${serviceName}]...`);
  execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${version.name}" --project=${project} --quiet`, { stdio: 'inherit' });

  // 4. Integration Verification
  console.log('🕵️‍♂️ Verifying system integration...');
  // Give Cloud Run a moment to restart with new config
  await new Promise(r => setTimeout(r, 10000)); 
  
  try {
    // Run verification script (inherits ADC environment)
    const cmd = `node scripts/verify_document.js --docId=${process.env.SMOKE_DOC_ID} --project=${project} --bucketName=${bucketName}`;
    execSync(cmd, { stdio: 'inherit', env: process.env });
    console.log('✨ Rotation & Verification Completed Successfully!');
  } catch (err) {
    console.error('❌ Verification FAILED. Initiating Rollback...');
    if (prevKms) {
      execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${prevKms}" --project=${project} --quiet`, { stdio: 'inherit' });
      console.log('✅ Rollback to previous key successful.');
    }
    process.exit(1);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
