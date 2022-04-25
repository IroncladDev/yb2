import ui from '../styles/ui.module.scss';
import Head from 'next/head';
import styles from '../styles/pages/login.module.scss'
import Link from 'next/link'

function BackSvg() {
  return (<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='none' style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="grad0" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="rgb(94, 139, 126)"></stop>
        <stop offset="1" stopColor="rgb(120, 172, 157)"></stop>
      </linearGradient>
    </defs>
    <path fill="url(#grad0)" d="M 0 0 C 0 100 16.667 166.667 50 200 C 83.333 233.334 150 250 250 250 C 250 150 233.333 83.334 200 50 C 166.667 16.667 100 0 0 0"></path>
    <path fill="url(#grad0)" d="M 500 300 C 500 400 533.333 483.334 600 550 C 633.333 583.334 700 600 800 600 C 800 500 783.333 433.334 750 400 C 683.333 333.334 600 300 500 300"></path>
    <path fill="url(#grad0)" d="M 0 600 L 0 500 C 133.333 466.667 213.144 431.255 313.144 364.588 C 378.584 309.271 447.69 275.06 550 200 C 639.738 128.234 666.667 66.667 700 0 L 800 0 L 800 100 C 700 133.334 628.001 192.819 538.548 256.544 C 399.898 355.317 311.899 414.916 311.899 414.916 C 178.566 481.583 133.333 533.334 100 600 L 0 600"></path>
  </svg>)
}

export default function Lost() {
  return (<>
    <Head>
      <title>Not Found | YouBarter</title>
    </Head>
    <div className={ui.relcont}>
      <div className={ui.overlayGrid}>
        <div className={ui.overlayer} style={{ background: 'var(--accent-primary-flash)', height: '100vh !important' }}>
          <BackSvg />
        </div>

        <div className={ui.overlayer}>
          <div className={styles.form + " " + ui.centerxy + " " + ui.absolute} style={{ maxWidth: 500, height: 'auto', textAlign: 'center', display: 'block' }}>
            <h3>404 You just broke the entire site.</h3>
            <p>Thanks pal, we&apos;ll chill out and have a 24-hour downtime.  Just kidding, the page you were looking for doesn&apos;t exist.</p>
            <Link href="/" passHref>
              <a>
                <button className={ui.buttonAction}>Return Home</button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>)
}