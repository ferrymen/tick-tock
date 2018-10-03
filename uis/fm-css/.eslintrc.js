module.exports = {
  env: {
    jest: true
  },
  extends: ["eslint-config-postcss", "prettier"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        semi: false,
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false
      }
    ]
  }
};
