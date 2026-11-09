import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  { ignores: [".next/**", "node_modules/**", "scripts/**", "tests/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Code copied from the Vite app keeps its original (non-strict) typing.
  { rules: { "@typescript-eslint/no-explicit-any": "off", "@typescript-eslint/no-unused-vars": "warn", "@typescript-eslint/no-empty-object-type": "off", "react-hooks/exhaustive-deps": "warn", "react/no-unescaped-entities": "off" } },
];
