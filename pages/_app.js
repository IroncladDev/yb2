import '../styles/globals.scss'
import Head from 'next/head'
import { useEffect, useState } from 'react';


function MyApp({ Component, pageProps }) {
  const [dark, setMode] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0);
    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(matched){
      setMode(true)
    }
  }, []);
  return (<>
    <Head>
      <link href={dark ? "/logo-light.svg" : "/logo.svg"} rel="icon" type="image/svg"/>
      <meta property="og:type" content="website" />
      <meta property="og:title" content="YouBarter"/>
      <meta property="og:description"
        content="YouBarter is a nonprofit organization platform built on integrity, created to connect people together."/>
      <meta property="og:url" content="https://youbarter.us"/>
      <meta property="og:image" content="/images/site.png"/>
      <meta property="og:image:type" content="image/png" />
      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="og:image:width" content="2560" />
      <meta property="og:image:height" content="1600" />
      <meta name="copyright" content="2022"></meta>
    </Head>
    <Component {...pageProps} />
  </>)
}

export default MyApp
