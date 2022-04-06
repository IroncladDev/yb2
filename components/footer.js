/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import ui from '../styles/ui.module.css'
import styles from '../styles/components/footer.module.css'
import { loadGetInitialProps } from 'next/dist/shared/lib/utils'
export default function Footer(props) {
  return (<div style={{ background: props.background }}>
    <svg viewBox="0 0 800 100" preserveAspectRatio='none' className={ui.blockSvg} style={{ maxHeight: 50, filter: 'drop-shadow(-5px -5px 10px rgba(0,0,0,0.2))' }}>
      <path d="M 0 100 L 800 100 L 800 0 Q 400 0 0 100" fill="var(--accent-primary-stronger)"></path>
    </svg>
    <div className={styles.footer}>
      <div className={styles.info}>
        <div className={styles.flexInfo}>
          <Link href="/">
            <a>
              <h2 style={{ color: 'var(--white-strongest)' }}>YouBarter</h2>
            </a>
          </Link>
          <Link href="/">
            <a>
              <img src="/logo-light.svg" alt="YouBarter Logo" className={styles.flexLogo} />
            </a>
          </Link>
        </div>
        <p>YouBarter is a nonprofit organization platform built on integrity, created to connect people together.</p>
        <p>&copy; YouBarter 2022</p>
      </div>
      <div className={styles.links}>
        <div className={styles.flexLinks}>
          <div className={styles.linkFlexer}>
            <Link href="/"><a className={styles.link}>Home</a></Link>
            <Link href="/about"><a className={styles.link}>About</a></Link>
            <Link href="/contact"><a className={styles.link}>Contact</a></Link>
            <Link href="/privacy"><a className={styles.link}>Privacy</a></Link>
          </div>
          <div className={styles.linkFlexer}>
            <Link href="/donate"><a className={styles.link}>Donate</a></Link>
            <Link href="/explore"><a className={styles.link}>Explore</a></Link>
            <Link href="/search"><a className={styles.link}>Search</a></Link>
            <Link href="/terms"><a className={styles.link}>Terms</a></Link>
          </div>
          <div className={styles.illustration}></div>
        </div>
      </div>
    </div>
  </div >)
}