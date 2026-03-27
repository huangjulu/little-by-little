import { Font } from "@react-pdf/renderer";

import { PDF_FONT_FAMILY } from "../constants";

Font.register({
  family: PDF_FONT_FAMILY,
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-400-normal.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-tc@latest/chinese-traditional-700-normal.ttf",
      fontWeight: 700,
    },
  ],
});
