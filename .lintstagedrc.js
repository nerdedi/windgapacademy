module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --max-warnings=0 --fix", "prettier --write"],
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "*.{md,mdx}": ["prettier --write"],
  allowEmpty: true,
};
