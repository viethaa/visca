import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* VISCA mark; SVG for modern browsers, PNG/ICO fallbacks, and a home-screen icon */}
        <link rel='icon' href='/icon.svg' type='image/svg+xml' />
        <link rel='icon' href='/favicon.png' type='image/png' sizes='64x64' />
        <link rel='alternate icon' href='/favicon.ico' sizes='48x48' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <meta name='theme-color' content='#222f30' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
