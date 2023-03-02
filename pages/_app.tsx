import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import styled from 'styled-components';
import { authService } from '@/firebase';
import { useState, useEffect } from 'react';

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
      <Header isLoggedIn={isLoggedIn} />
      <Layout>
        <SideNav isLoggedIn={isLoggedIn} />
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

const Layout = styled.div`
  display: flex;
`;
