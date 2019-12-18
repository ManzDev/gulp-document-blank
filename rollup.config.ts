import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/js/index.ts",
  output: {
    format: "es"
  },
  plugins: [typescript()]
};
