const PDFDocument = require('pdfkit');

function generateResume(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Set up styles
      doc.fontSize(25).text(resumeData.name, { align: 'center', underline: true });
      doc.moveDown(0.5);

      doc.fontSize(14).fillColor('black');

      // Email
      doc.font('Helvetica-Bold').text('Email: ', { continued: true });
      doc.font('Helvetica').text(resumeData.email).moveDown(0.5);
      
      // GitHub Link with title
      doc.font('Helvetica-Bold').text('GitHub: ', { continued: true });
      doc.fillColor('blue').text(resumeData.github, { link: resumeData.github, underline: true });
      doc.fillColor('black').moveDown(0.5);

      // LinkedIn Link with title
      doc.font('Helvetica-Bold').text('LinkedIn: ', { continued: true });
      doc.fillColor('blue').text(resumeData.linkedin, { link: resumeData.linkedin, underline: true });
      doc.fillColor('black'); // reset the color for the rest of the text
      doc.moveDown(1.5);

      // Academic Information Section
      doc.fontSize(18).fillColor('blue').text('Academic Information', { underline: true });
      doc.moveDown(0.5);

      // Draw table-like structure for academic information
      const tableTop = doc.y;
      const tableCol1X = 50; // X position for the first column
      const tableCol2X = 250; // X position for the second column
      const columnWidth1 = 200; // Width of the first column
      const columnWidth2 = 200; // Width of the second column

      // Table headers
      doc.fontSize(14).fillColor('black');
      doc.font('Helvetica-Bold').text('Description', tableCol1X, tableTop, { width: columnWidth1 });
      doc.font('Helvetica-Bold').text('Details', tableCol2X, tableTop, { width: columnWidth2 });

      // Horizontal line below headers
      doc.moveDown(0.5);
      doc.moveTo(tableCol1X - 10, doc.y).lineTo(500, doc.y).stroke();
      doc.moveDown(0.5);

      // Academic Information Rows
      const academicInfo = [
        { title: '10th Percentage', value: `${resumeData.tenthMarks}%` },
        { title: '12th Percentage', value: `${resumeData.twelfthMarks}%` },
        { title: 'SGPA', value: resumeData.sgpa },
        { title: 'CGPA', value: resumeData.cgpa },
      ];

      academicInfo.forEach((info) => {
        doc.font('Helvetica').text(info.title, tableCol1X, doc.y, { width: columnWidth1 });
        doc.font('Helvetica').text(info.value, tableCol2X, doc.y, { width: columnWidth2 });
        doc.moveDown(0.5);
        doc.moveTo(tableCol1X - 10, doc.y).lineTo(500, doc.y).stroke();
        doc.moveDown(0.5);
      });

      doc.moveDown(1.5); // Ensure enough space after the academic info

      // Certificates Section
      doc.fontSize(18).fillColor('blue').text('Certificates', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(14).fillColor('black');
      resumeData.certificates.forEach((cert, index) => {
        doc.text(`${index + 1}. ${cert}`, { align: 'left' });
      });
      doc.moveDown(1.5); // Ensure enough space after the certificates

      // Skills Section with professional boxes
      doc.fontSize(18).fillColor('blue').text('Skills', { underline: true });
      doc.moveDown(0.5);

      // Define styles for the skill boxes
      const skillBoxWidth = 120;
      const skillBoxHeight = 30;
      const startX = 50;
      let startY = doc.y;

      resumeData.skills.forEach((skill, index) => {
        if (index !== 0 && index % 4 === 0) {
          startY += skillBoxHeight + 10; // move to next row after 4 skills
        }

        const xPos = startX + (index % 4) * (skillBoxWidth + 10); // calculate x position

        // Draw background rectangle for the skill
        doc.rect(xPos, startY, skillBoxWidth, skillBoxHeight)
          .fillAndStroke('#f0f0f0', '#d0d0d0'); // light grey fill with grey border

        // Add skill name in the center of the box
        doc.fillColor('black')
          .fontSize(12)
          .text(skill, xPos, startY + 8, { width: skillBoxWidth, align: 'center' });
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = generateResume;
