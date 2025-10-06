module.exports = {
  "*.{js,jsx,ts,tsx}": ["prettier --write"],
  "*.{css,scss,md}": ["prettier --write"],
  // This setting allows empty commits when no staged files match the patterns
  allowEmpty: true,
};
