import Lottie from 'react-lottie-player';
import styled from 'styled-components';
import logo from '../../../public/assets/animation/loading.json';
const Loading = () => {
  return (
    <LottieWrapper>
      <StyledLottie loop animationData={logo} play />
    </LottieWrapper>
  );
};
const LottieWrapper = styled.div`
  ${({ theme }) => theme.mainLayout.wrapper}
`;

const StyledLottie = styled(Lottie)`
  width: 400px;
`;
export default Loading;
