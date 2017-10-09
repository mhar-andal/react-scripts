#!/usr/bin/env node

const spawn = require('child_process').spawnSync;
const log = require('../config/utils/log');

const script = process.argv[2];
const args = process.argv.slice(3);

switch (script) {
  case 'lint':
  case 'build':
  case 'start':
  case 'test': {
    const result = spawn('node', [require.resolve(`../scripts/${script}`)].concat(args), { stdio: 'inherit' });
    if (result.signal) {
      if (result.signal === 'SIGKILL' || result.signal === 'SIGTERM') {
        log(`The build failed because the process exited too early (${result.signal})`);
      }
      process.exit(1);
    }
    process.exit(result.status);
    break;
  }
  default: {
    log(`Unknown script "${script}".`);
    break;
  }
}
