const fs = require('fs');
const path = require('path');

function getFileSize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
}

module.exports = (filePath) => {
  const results = [];

  const traverse = (currentPath, output) => {
    if (!fs.existsSync(currentPath)) return;

    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      if (file.includes('map')) return;

      const currentFile = `${currentPath}/${file}`;
      const stats = fs.statSync(currentFile);

      if (stats.isFile()) {
        if (!file.includes('.DS_Store')) {
          const ext = path.extname(file).split('.').pop();
          const fileName = currentFile
            .replace(`${filePath}/`, '')
            .replace(`${ext}/`, '')
            .replace('js/', '')
            .replace('css/', '');

          output.push({
            name: fileName,
            size: getFileSize(stats.size),
          });
        }
      } else if (stats.isDirectory()) {
        traverse(currentFile, output);
      }
    });
  };

  traverse(filePath, results);

  return results;
};
