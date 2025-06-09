const fs = require('fs');
const path = require('path');

const musicDir = path.join(__dirname, '../public/music');
const outputFile = path.join(__dirname, '../public/music-list.json');

const files = fs.readdirSync(musicDir)
  .filter(file => file.endsWith('.mp3'))
  .map(file => `/music/${file}`);

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2), 'utf-8');
console.log(`已生成 ${outputFile}，共${files.length}首歌曲`); 