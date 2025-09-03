function timestamp() {
  return new Date().toISOString();
}

module.exports = {
  debug: (...args) => console.log(`[DEBUG] ${timestamp()}`, ...args),
  info: (...args) => console.log(`[INFO] ${timestamp()}`, ...args),
  error: (...args) => console.error(`[ERROR] ${timestamp()}`, ...args),
};
