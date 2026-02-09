module.exports = {
  root: true,

  env: {
    browser: true,
    es2022: true
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },

  plugins: [
    "@typescript-eslint"
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],

  rules: {
    /* 🔧 Praxisnah */
    "no-console": "off",

    /* ❌ JS-Regeln aus, TS-Regeln an */
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "argsIgnorePattern": "^_" }
    ],

    /* 🧠 TS-Erleichterungen (API-Daten!) */
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",

    /* 🛡️ Sicherheit */
    "eqeqeq": ["error", "always"],

    /* ✨ Style */
    "semi": ["error", "never"],
    "quotes": ["error", "double"]
  }
}
