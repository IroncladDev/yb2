/* eslint-disable @next/next/no-img-element */
import ui from '../styles/ui.module.css';
import styles from '../styles/components/nav.module.css'
import { useState } from 'react';
import Link from 'next/link'
export default function Nav(){
  const [vis, setVis] = useState(true);
  return (
  <div className={styles.navCore}>
    <button className={styles.navBtn} onClick={() => setVis(!vis)}>
      <img src={vis ? "/icons/menu-white.svg" : "/icons/menu.svg"} alt="Menu Icon"/>
    </button>
    <div className={styles.navBody + " " + (vis ? styles.navIn : styles.navOut)}></div>
    <div className={styles.navLinks + " " + (vis ? styles.linksIn : styles.linksOut)}>

      <Link href="/" passHref>
        <button className={styles.navLink}>
          <div className={styles.hideText}>Navigate to the homepage</div>
          <a style={{display: 'flex'}}>
            <div style={{flexGrow: 1}}></div>
            <img className={styles.homeImg} style={{alignSelf: 'center', justifySelf: 'flex-end', padding: 5}} src="/logo-light.svg" alt="YouBarter Logo"/>
          </a>
        </button>
      </Link>

      <Link href="/about" passHref>
        <button className={styles.navLink}>
          <div className={styles.hideText}>Read our story, how we came to be, and more!</div>
          <a>About Us</a>
        </button>
      </Link>

      <Link href="/login" passHref>
        <button className={styles.navLink}>
          <div className={styles.hideText}>Already have an account?  Log in and keep going!</div>
          <a>Log In</a>
        </button>
      </Link>

      <Link href="/signup" passHref>
        <button className={styles.navLink}>
          <div className={styles.hideText}>Come and join us!  Let&apos;s help each other out together!</div>
          <a>Join Us</a>
        </button>
      </Link>
    </div>
  </div>
  )
}