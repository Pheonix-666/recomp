import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testCompress() {
  const fileBytes = fs.readFileSync('dummy.pdf');
  const doc = await PDFDocument.load(fileBytes);
  const compressed = await doc.save({ useObjectStreams: true });
  console.log(`Original: ${fileBytes.length}, Compressed: ${compressed.length}`);
}

testCompress().catch(console.error);
