export default {
  "*.{ts,mts,cts,json,jsonc,json5,md}": (filenames) => {
    const validFiles = filenames.filter((f) => !f.endsWith("package-lock.json"));
    if (validFiles.length === 0) return [];

    const files = validFiles.map((f) => `"${f}"`).join(" ");

    return [`eslint --fix ${files}`, `prettier --write ${files}`];
  },
  "*.{yml,yaml}": (filenames) => {
    const files = filenames.map((f) => `"${f}"`).join(" ");
    return `prettier --write ${files}`;
  },
};
