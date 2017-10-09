module.exports = (version, callback) => {
  const spawn = require('child_process').spawn;
  const gitPush = spawn('git', ['push', 'origin', 'master'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', process.stderr],
  });

  gitPush.on('exit', (code) => {
    if (code === 0) {
      callback && callback(true);
    }
  });
};
