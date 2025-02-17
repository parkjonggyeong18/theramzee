import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DOSMyungjo';
    src: url('/fonts/DOSMyungjo.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    font-family: 'DOSMyungjo', sans-serif;
  }
`;

export default GlobalStyle;
