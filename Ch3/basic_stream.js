var crypto = require("crypto");
const fs = require('fs');

function copyFileWithStream(src, dest, callback) {
  fs.createReadStream(src)
    .pipe(crypto.createHash('sha256'))
    .pipe(fs.createWriteStream(dest))
    .on('finish', callback);
}

fs.writeFileSync('src.txt', 'src content');
copyFileWithStream('src.txt', 'dest.txt', () => console.log('copy finished'))