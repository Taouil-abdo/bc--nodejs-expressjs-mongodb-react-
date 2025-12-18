import PDFDocument from 'pdfkit';
import fs from 'fs';

console.log('Testing PDF generation...');

try {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream('test-output.pdf');
    
    doc.pipe(stream);
    
    doc.fontSize(20).text('Test PDF Generation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('If you can read this, pdfkit is working correctly!');
    
    doc.end();
    
    stream.on('finish', () => {
        console.log('✅ PDF generated successfully! Check test-output.pdf');
        process.exit(0);
    });
    
    stream.on('error', (err) => {
        console.error('❌ Error writing PDF:', err);
        process.exit(1);
    });
} catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    console.log('\nTo fix this, run: npm install pdfkit');
    process.exit(1);
}
