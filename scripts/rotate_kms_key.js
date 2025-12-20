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
  .option('keyFile', { type: 'string', demandOption: true }) // קבלת נתיב המפתח
  .option('region', { type: 'string', default: 'us-central1' })
  .option('gcloudPath', { type: 'string', default: 'gcloud' })
  .help().parse();

const kms = new KeyManagementServiceClient();

async function main() {
  const { project, keyRing, key, functionName, bucketName, keyFile, region, gcloudPath: gcloud } = argv;
  const parent = `projects/${project}/locations/${region}/keyRings/${keyRing}/cryptoKeys/${key}`;

  console.log(`🔄 Starting Rotation for ${functionName}...`);
  
  // 1. Create Version
  const [version] = await kms.createCryptoKeyVersion({
    parent,
    cryptoKeyVersion: { template: { algorithm: 'RSA_SIGN_PKCS1_2048_SHA256' } }
  });
  console.log(`✅ Created new version: ${version.name}`);

  // 2. Local Verify
  console.log('🧪 Testing locally...');
  const testPayload = Buffer.from('test-' + Date.now());
  const digest = crypto.createHash('sha256').update(testPayload).digest();
  await new Promise(r => setTimeout(r, 2000));

  const [signResp] = await kms.asymmetricSign({ name: version.name, digest: { sha256: digest } });
  const [pubResp] = await kms.getPublicKey({ name: version.name });
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(testPayload);
  if (!verifier.verify(pubResp.pem, Buffer.from(signResp.signature))) throw new Error('Local verify failed');
  console.log('✅ Local verified.');

  // 3. Update Cloud Run
  const serviceName = functionName.toLowerCase();
  let prevKms = '';
  try {
    const jsonOut = execSync(`${gcloud} run services describe ${serviceName} --region=${region} --format=json --project=${project}`, { encoding: 'utf8' });
    prevKms = JSON.parse(jsonOut)?.spec?.template?.spec?.containers?.[0]?.env?.find(e => e.name === 'KMS_KEY_NAME')?.value || '';
  } catch (e) {}

  console.log(`🚀 Updating ${serviceName}...`);
  execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${version.name}" --project=${project} --quiet`, { stdio: 'inherit' });

  // 4. Integration Verify
  console.log('🕵️‍♂️ Verifying system health...');
  await new Promise(r => setTimeout(r, 15000)); 
  
  // התיקון הגדול: מעבירים את נתיב הקובץ הלאה לסקריפט הבא
  const cmd = `node scripts/verify_document.js --docId=${process.env.SMOKE_DOC_ID} --project=${project} --bucketName=${bucketName} --keyFile="${keyFile}"`;
  console.log(`Running verification with key file: ${keyFile}`);
  
  try {
    execSync(cmd, { stdio: 'inherit', env: process.env });
    console.log('✅ Rotation & Verification Complete Success!');
  } catch (err) {
    console.error('❌ Verification FAILED. Rolling back...');
    if (prevKms) {
      execSync(`${gcloud} run services update ${serviceName} --region=${region} --update-env-vars KMS_KEY_NAME="${prevKms}" --project=${project} --quiet`, { stdio: 'inherit' });
      console.log('✅ Rollback successful.');
    }
    process.exit(1);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
