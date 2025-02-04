const fs = require('fs');
const path = require('path');

function saveFile(stream, filePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        stream.on('data', chunk => fileStream.write(chunk));
        stream.on('end', () => {
            fileStream.end();
            resolve(filePath);
        });
        stream.on('error', reject);
    });
}

module.exports = { saveFile };
