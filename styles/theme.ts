export const theme = {
  color: {
    backgroundColor: '#FFFCF3',
    brandColor: '#FF4800',
    brandColor100: '#FF3D00',
    brandColor50: '#afsdaa',

    black: '#000000',
  },
  btn: {
    category: `
      min-width: 120px;
      height: 50px;
      padding: 0 25px;
      border-radius: 50px;
      border: none;

      background-color: #d9d9d9;
      color: #000;
      :hover {
        background-color: #000;
        color: #fff;
      }
      :focus {
        background-color:#ff0000;
        color:#00ff00;
      }
    `,
    btn100: `
      min-width: 120px;

      height: 50px;
      padding: 0 25px;
      border-radius: 50px;
      border: none;
      font-size: 16px;

      background-color: #d9d9d9;
      color: #000;
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
      border: none;
      font-size : 16px;

      background-color: #d9d9d9;
      color: #000;
      :hover {
        background-color: #000;
        color: #fff;
      }
    `,

    btn30: `
      min-width : 80px;
      height : 30px;
      padding : 0 15px;
      border-radius : 30px;
      border: none;
      font-size : 14px;

      background-color: #d9d9d9;
      color: #000;
      :hover {
        background-color: #000;
        color: #fff;
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
      background-color:#FFFCF3;
  `,
    container: `
      min-width : 640px;
      width : 100%;
      max-width : 1220px;
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
      background-color: #eee;
    `,
  input: `
      width: 100%;
      border: none;
      outline: none;
      background-color: #eee;
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
