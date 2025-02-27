const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

function imagesToPdf(imagePaths, outputPdfPath) {
  const doc = new PDFDocument({ size: "A4" });
  const stream = fs.createWriteStream(outputPdfPath);
  doc.pipe(stream);

  const imagesPerPage = 12;
  const imagesPerRow = 4;
  const margin = 30;
  const imageWidth = (doc.page.width - margin * 6) / imagesPerRow;
  const imageHeight = imageWidth * (16 / 7.5);
  const fontSize = 8;

  imagePaths.forEach((imagePath, index) => {
    if (index !== 0 && index % imagesPerPage === 0) doc.addPage();

    const row = Math.floor((index % imagesPerPage) / imagesPerRow);
    const col = index % imagesPerRow;

    const x = margin + col * (imageWidth + margin);
    const y = margin + row * (imageHeight + margin);

    doc.image(imagePath, x, y, { width: imageWidth, height: imageHeight });

    let fileName = path.basename(imagePath);

    fileName = fileName.split(".");
    fileName.pop();
    fileName = fileName.join("");
    doc.fontSize(fontSize).fillColor("black");
    const textWidth = doc.widthOfString(fileName);
    const textX = x + (imageWidth - textWidth) / 2;
    const textY = y + imageHeight + 5;

    doc.text(fileName, textX, textY, { width: imageWidth, align: "center" });
  });

  doc.end();
  stream.on("finish", () =>
    console.log(`PDF created successfully: ${outputPdfPath}`)
  );
}

const directoryPath = path
  .resolve(
    "D:",
    "TeaBreak Maintainance",
    "2023",
    "Online Payments",
    "2024",
    "January2025"
  )
  .replace("Pdfgenerator", "SophiaJ");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const fileArray = files.map(function (file) {
    return path.join(directoryPath, file);
  });
  console.log(fileArray);
  imagesToPdf(fileArray, "January 2025.pdf");
});
