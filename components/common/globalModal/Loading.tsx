import Lottie from 'react-lottie-player';
import styled from 'styled-components';
import logo from '../../../public/assets/animation/loading.json';
const Loading = () => {
  return (
    <LottieWrapper>
      <Lottie loop animationData={logo} play />
    </LottieWrapper>
  );
};
const LottieWrapper = styled.div`
  width: 400px;
`;
export default Loading;
