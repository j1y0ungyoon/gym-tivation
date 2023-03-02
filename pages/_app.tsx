import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import styled, { ThemeProvider } from 'styled-components';
import { authService } from '@/firebase';
import { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from '@/styles/GlobalStyle';

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Header isLoggedIn={isLoggedIn} />
        <Layout>
          <SideNav isLoggedIn={isLoggedIn} />
          <Component {...pageProps} />
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
  );
}

const Layout = styled.div`
  display: flex;
`;
