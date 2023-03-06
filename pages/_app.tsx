import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import styled, { ThemeProvider } from 'styled-components';
import { authService } from '@/firebase';
import { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from '@/styles/GlobalStyle';
import { RecoilRoot } from 'recoil';
import GlobalModal from '@/components/common/globalModal/GlobalModal';
//queryClient 캐시관리 app 컴포넌트 안에 있으면 계속 갱신 (이전값을 캐싱)
const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Header isLoggedIn={isLoggedIn} />
          <Layout>
            <SideNav isLoggedIn={isLoggedIn} />
            <Component {...pageProps} />
            <GlobalModal />
          </Layout>
        </ThemeProvider>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

const Layout = styled.div`
  display: flex;
`;
