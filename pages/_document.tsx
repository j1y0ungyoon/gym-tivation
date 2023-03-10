import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html lang="kr">
        <title>Gymtivation</title>
        <Head>
          <meta name="description" content="당신의 득근 파트너스 Gymtivation" />
          <meta property="og:type" content={'website'} />
          <meta property="og:title" content={'짐티베이션'} />
          <meta
            property="og:description"
            content={'당신의 득근 파트너스 Gymtivation'}
          />
          <meta property="og:url" content={'gymtivation.site'} />
          <meta
            property="og:image"
            content={
              'https://firebasestorage.googleapis.com/v0/b/gym-tivation.appspot.com/o/gymtivation%2FOGTAG.png?alt=media&token=8b47b982-6ad1-47b1-adea-7c5d0ceb1dd6'
            }
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`}
            strategy="beforeInteractive"
          />
        </body>
      </Html>
    );
  }
}
