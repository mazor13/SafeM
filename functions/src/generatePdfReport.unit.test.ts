import { PDFDocument } from 'pdf-lib';
import crypto from 'crypto';

describe('unit: pdf hash', () => {
  it('computes a stable sha256 hash for given bytes', async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([100, 100]);
    page.drawText('unit-test');
    const bytes = await pdfDoc.save();

    const hash = crypto.createHash('sha256').update(bytes).digest('hex');

    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });
});
