import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import styled from 'styled-components';

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Layout>
        <SideNav />
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

const Layout = styled.div`
  display: flex;
`;
