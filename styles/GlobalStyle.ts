import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
.ql-size-small {
  font-size: 0.75rem;
}
.ql-size-large {
  font-size: 1.5rem;
}
.ql-size-huge {
  font-size: 2.5rem;
}
body {background-color: #FFFCF3;
  font-family: 'Pretendard-Regular';
}

@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

`;
export default GlobalStyle;
