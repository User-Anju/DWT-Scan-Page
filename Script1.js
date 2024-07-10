// JavaScript source code
// Function to load images into the viewer
function loadImages(imageUrls) {
    var viewer = document.getElementById('imageViewer');
    viewer.innerHTML = ''; // Clear previous images

    imageUrls.forEach(function (url) {
        var img = document.createElement('img');
        img.src = url;
        viewer.appendChild(img);
    });
}

var images = [
    'C:/Users/alexk/source/repos/Images/image1.png',
    'C:/Users/alexk/source/repos/Images/image2.png',
    'C:/Users/alexk/source/repos/Images/image3.png',
    'C:/Users/alexk/source/repos/Images/image4.png',
    'C:/Users/alexk/source/repos/Images/image5.png',
    'C:/Users/alexk/source/repos/Images/image6.png'
];

loadImages(images);



Dynamsoft.WebTwainEnv.Load();
let scanner;

document.getElementById('scanButton').addEventListener('click', async () => {
    if (!scanner) {
        scanner = await Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
        if (!scanner) {
            alert('Failed to initialize Dynamic Web TWAIN.');
            return;
        }
    }

    try {
        const images = await scanner.acquireImage();
        if (images && images.length > 0) {
            // Send images to server for saving as PDF
            saveImagesAsPDF(images);
        } else {
            alert('No images were scanned.');
        }
    } catch (ex) {
        console.error('Error scanning images:', ex);
        alert('Failed to scan images.');
    }
});

async function saveImagesAsPDF(images) {
    const formData = new FormData();
    images.forEach((image, index) => {
        formData.append(`image${index}`, image);
    });

    try {
        const response = await fetch('/saveImagesAsPDF', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Images saved as PDF successfully.');
        } else {
            alert('Failed to save images as PDF.');
        }
    } catch (ex) {
        console.error('Error saving images as PDF:', ex);
        alert('Failed to save images as PDF.');
    }
}

const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;

const app = express();
const upload = multer();

app.post('/saveImagesAsPDF', upload.array('image'), async (req, res) => {
    const images = req.files;
    const pdfDoc = await PDFDocument.create();
    const { width, height } = images[0]; // Assuming all images have the same dimensions

    for (let image of images) {
        const imageBytes = await fs.readFile(image.path);
        const pngImage = await pdfDoc.embedPng(imageBytes);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile('D:/temp/result.pdf', pdfBytes);

    res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on port 3000'));

function Upload() {
    if (DWObject && DWObject.HowManyImagesInBuffer > 0) {
        var strUrl = "https://demo.dynamsoft.com/Resources/";
        var imgAry = [DWObject.CurrentImageIndexInBuffer];
        DWObject.HTTPUpload(
            strUrl,
            imgAry,
            Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
            Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary,
            "WebTWAINImage.png",
            onUploadSuccess,
            onUploadFailure);
    } else {
        alert("There is no image in buffer.");
    }
}

function onUploadSuccess() {
    alert('Upload successful');
}

function onUploadFailure(errorCode, errorString, sHttpResponse) {
    alert(sHttpResponse.length > 0 ? sHttpResponse : errorString);
}




