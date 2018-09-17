import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<any>;

export { css, injectGlobal, keyframes, ThemeProvider };
export default styled;