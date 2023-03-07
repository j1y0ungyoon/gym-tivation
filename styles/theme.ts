export const theme = {
  color: {
    backgroundColor: '#FFFCF3',
    brandColor100: '#FF3D00',
    brandColor50: '#FFCAB5',

    black: '#000000',
  },
  btn: {
    category: `
      min-width: 120px;
      height: 50px;
      padding: 0 25px;
      border-radius: 50px;
      border: 1px solid black;

      background-color: #fff;
      color: #000;
      :hover {
        background-color: #FF3D00;
        color: #fff;
      }
      :focus {
        background-color:#FF3D00;
        color:white;
      }
    `,
    btn100: `
      min-width: 120px;
      height: 50px;
      padding: 0 25px;
      border-radius: 50px;
      border: 1px solid black;
      font-size: 16px;
      background-color: #FF3D00;
      color: #fff;
      :hover {
        background-color: #000;
        color: #fff;
      }
    `,

    btn50: `
      min-width : 100px;
      height : 40px;
      padding : 0 20px;
      border-radius : 40px;
      border: 1px solid black;
      font-size : 16px;

      background-color: #000;
      color: #fff;
      :hover {
        background-color: #fff;
        color: #000;
      }
    `,

    btn30: `
      min-width : 80px;
      height : 30px;
      padding : 0 15px;
      border-radius : 30px;
      border: 1px solid black;
      font-size : 14px;

      background-color: #000;
      color: #fff;
      :hover {
        background-color: #fff;
        color: #000;
      }
    `,
  },
  mainLayout: {
    wrapper: `
      display : flex;
      justify-content : center;
      min-width : 1000px;
      width : calc(100vw - 180px);
      min-height : 740px;
      height : calc(100vh - 80px);
      margin : 0 auto;
      margin-left : 180px;
      background-color:#FFFCF3;
      border-left : 1px solid #f0dcca;
      padding: 0 20px
  `,
    container: `
      min-width : 640px;
      width : 100%;
      max-width : 1440px;
      margin : 20px auto;
      height:100%;
    `,
  },
  font: {
    font100: '48px',
    font90: '36px',
    font70: '24px',
    font50: '18px',
    font30: '16px',
    font10: '14px',
  },

  inputDiv: `
      display: flex;
      align-items: center;
      min-width : 80px;
      height : 40px;
      border-radius : 20px;
      justify-content: space-between;
      padding : 0 20px;
      background-color: #fff;
    `,
  input: `
      width: 100%;
      border: none;
      outline: none;
      background-color: #fff;
    `,

  profileDiv: `
    width : 40px;
    height : 40px;
    border-radius : 40px;
    object-fit : cover;
  `,

  borderRadius: {
    radius100: '40px',
    radius50: '20px',
    radius10: '10px',
  },
};
