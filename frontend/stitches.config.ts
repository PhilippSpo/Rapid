import { createStyled } from "@stitches/react";

export const { styled, css } = createStyled({
  prefix: "",
  tokens: {
    space: {
      $1: "0.25rem",
      $2: "0.5rem",
      $3: "0.75rem",
      $4: "1rem",
      $5: "1.25rem",
      $6: "1.5rem",
      $7: "1.75rem",
      $8: "2rem",
      $9: "2.25rem",
      $10: "2.5rem",
      $11: "2.75rem",
      $12: "3rem",
      $14: "3.5rem",
      $16: "4rem",
      $20: "5rem",
    },
  },
  breakpoints: {
    bp1: (rule) => `@media (min-width: 640px) { ${rule} }`,
    bp2: (rule) => `@media (min-width: 768px) { ${rule} }`,
    bp3: (rule) => `@media (min-width: 1024px) { ${rule} }`,
    bp4: (rule) => `@media (min-width: 1280px) { ${rule} }`,
    landscape: (rule) => `@media (orientation: landscape) { ${rule} }`,
  },
  utils: {},
});
