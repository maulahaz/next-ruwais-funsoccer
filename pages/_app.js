import '../styles/globals.css'
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  return (
    <> <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content="Ruwais Gibol" />
      <meta name="keywords" content="gibol" />
      <title>Ruwais Gibol</title>

      <link rel="manifest" href="/manifest.json" />
      <link
        href="/icons/favicon-16x16.png"
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href="/icons/favicon-32x32.png"
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link rel="apple-touch-icon" href="/apple-icon.png"></link>
      <meta name="theme-color" content="#000000" />
    </Head>
      <Component {...pageProps} />
    </>)
}

export default MyApp
