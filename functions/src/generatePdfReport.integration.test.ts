import axios from 'axios';

const PROJECT = process.env.FIREBASE_PROJECT || 'ozen-staging-2025';
const REGION = 'us-central1';
const FUNC = 'generatePdfReport';

describe('integration: generatePdfReport (emulator)', () => {
  it('calls the function running in the emulator and returns metadata', async () => {
    // Emulator functions host default:
    const url = `http://localhost:5001/${PROJECT}/${REGION}/${FUNC}`;
    const res = await axios.post(url, {
      inspectionId: 'integration-test-1',
      title: 'Integration Test'
    }, { timeout: 20000 });

    expect(res.status).toBe(200);
    const body = res.data;
    expect(body).toHaveProperty('inspectionId', 'integration-test-1');
    expect(body).toHaveProperty('filePath');
    expect(body).toHaveProperty('hash');
    // signature may be null in emulator unless KMS mocked/routed
  }, 30000);
});
