const TYPES = {
  error: '❗',
  success: '🔥',
  notify: '✉️',
  // release: '🚀',
  robot: '🤖',
  undefined: '',
};

function log(text, type, ...args) {
  if (args.includes(2)) console.log();
  console.log(TYPES[type] ? `${TYPES[type]}  ${text}` : text);
  if (args.includes(1) || args.includes(2)) console.log();
  return text;
}

module.exports = (text, ...args) => log(text, 'none', ...args);
module.exports.robot = (text, ...args) => log(text, 'robot', ...args);
module.exports.error = (text, ...args) => log(text, 'error', ...args);
module.exports.success = (text, ...args) => log(text, 'success', ...args);
// module.exports.release = (text, ...args) => log(text, 'release', ...args);
module.exports.notify = (text, ...args) => log(text, 'notify', ...args);
