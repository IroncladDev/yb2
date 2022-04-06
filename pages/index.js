/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/index.module.css'
import ui from '../styles/ui.module.css'
import Nav from '../components/nav'
import Fade from '../components/fade'
import Link from 'next/link'
import Footer from '../components/footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | YouBarter</title>
      </Head>
      <div>
        <Nav />
        <div className={ui.relcont + " " + ui.overlayGrid} style={{ background: 'var(--accent-primary-flash)' }}>
          <div className={ui.overlayer + " " + ui.fadeOnLoad}>
            <svg viewBox="0 0 800 600" preserveAspectRatio='none' style={{
              height: '100%',
              width: '100vw'
            }}>
              <linearGradient id="grad-light-1" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary-flash)" />
                <stop offset="100%" stopColor="var(--accent-primary-strongest)" />
              </linearGradient>
              <path fill="url(#grad-light-1)" d="M 0 0 L 0 150 C 100 25 175 100 275 0 L 0 0" />
              <path fill="url(#grad-light-1)" d="M 0 600 C 600 525 375 250 800 200 L 800 600 L 0 600"></path>
            </svg>
          </div>
          <div className={ui.overlayer + " " + ui.fadeOnLoad + " " + ui.centerWrap}>
            <div className={styles.flexHead + " " + ui.centerxy + " " + ui.relative}>
              <div className={styles.headerTop}>
                <div className={styles.boundContainer}>
                  <h1 className={styles.headerTitle}>“Alone, we can do so little; Together, we can do so much”</h1>
                  <h6 style={{ color: 'var(--foreground-dimmer)' }} className={styles.headerAuthor}>- Helen Keller</h6>
                  <p className={styles.centerPar}>As a community, we can help each other in times of need. YouBarter is created so the community can support one another and grow stronger.</p>
                  <Link href="/signup" passHref>
                    <a>
                      <button className={ui.buttonActionAlt + " " + styles.startButton}>Get Started</button>
                    </a>
                  </Link>
                </div>
              </div>
              <div className={styles.headerFlexRight}>
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="pattern1" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                      <image height="1" width="1" xlinkHref="/images/index-pic-0.jpeg" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                    <pattern id="pattern2" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                      <image height="1" width="1" xlinkHref="/images/family1.jpg" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                    <pattern id="pattern3" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                      <image height="1" width="1" xlinkHref="/images/family2.jpg" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                    <pattern id="pattern4" height="100%" width="100%" patternContentUnits="objectBoundingBox">
                      <image height="1" width="1" xlinkHref="/images/img3.jpg" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                  </defs>
                  <circle cx="50" cy="50" r="50" fill="url(#pattern1)" />
                  <circle style={{ filter: "drop-shadow(-1px 1px 1px rgba(0,0,0, 0.2))" }} cx="85" cy="15" r="15" fill="url(#pattern2)" />
                  <circle style={{ filter: "drop-shadow(-2px -2px 2px rgba(0,0,0,0.4))" }} cx="80" cy="80" r="20" fill="url(#pattern3)" />
                  <circle style={{ filter: "drop-shadow(2px -2px 2px rgba(0,0,0,0.4))" }} cx="10" cy="75" r="10" fill="url(#pattern4)" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={ui.relcont} style={{ background: 'var(--background-default)', minHeight: 0, paddingBottom: '120px' }}>
          <div className={ui.slantPath} style={{
            clipPath: "polygon(0% 0%, 0% 100%, 100% 0%)",
            background: 'var(--accent-primary-strongest)',
            marginBottom: 'calc(var(--space-16) * 2)'
          }}></div>
          <Fade>
            <h1 className={ui.title1}>What we do</h1>
          </Fade>
          <Fade>
            <p className={ui.blockParagraph}>The idea of bartering is not new to us and we may not have the immediate need for it. Our goal is to provide individuals a master list of people that are willing to barter when times get tough. In times of uncertainty, we don&apos;t know when there will be another financial crisis, catastrophic weather event, or simply a difficult situation in our lives.</p>
          </Fade>
        </div>

        <div className={ui.relcont} style={{ background: 'var(--accent-primary-flash)', }}>
          <svg viewBox="0 0 800 150" preserveAspectRatio='none' className={ui.blockSvg}>
            <path fill="var(--background-default)" d="M 0 0 Q 350 125 800 100 L 800 0 L 0 0" />
          </svg>

          <div className={styles.feature + " " + ui.centerx}>
            <img src="/icons/goods.svg" alt="Icon for Goods" className={styles.ftimg} />
            <div>
              <h3>Goods</h3>
              <p>Trade a large selection of things from natural resources to food, arts, and crafts!  </p>
            </div>
          </div>

          <div className={styles.feature + " " + ui.centerx}>
            <img src="/icons/services.svg" alt="Icon for Goods" className={styles.ftimg} />
            <div>
              <h3>Services</h3>
              <p>Lawn Mowing, car repairs, cleaning, ... you name it!  Any service can be done in exchange for a type of good or another service.</p>
            </div>




          </div>

          <div className={styles.feature + " " + ui.centerx}>
            <img src="/icons/country.svg" alt="Icon for Goods" className={styles.ftimg} />
            <div>
              <h3>Find the community around you</h3>
              <p>The YouBarter community spans the entire country.  It&apos;s easy to find others around you and to get your goods and services some visibility.</p>
            </div>
          </div>
          <div style={{ opacity: 0 }}>.</div>
        </div>

        <div className={ui.relcont} style={{ background: 'var(--background-default)', paddingBottom: '15vh' }}>
          <svg viewBox="0 0 800 150" preserveAspectRatio='none' className={ui.blockSvg}>
            <path fill="var(--accent-primary-flash)" d="M 0 0 L 0 125 Q 250 25 800 0 L 0 0" />
          </svg>

          <Fade>
            <h1 className={ui.title1}>Come and join us!</h1>
          </Fade>
          <Fade>
            <p className={ui.blockParagraph + " " + ui.textCenter} style={{ paddingBottom: 20 }}>“Let your light so shine before men, that they may see your good works and glorify your Father in heaven.” - Matthew 5:16</p>
          </Fade>
          <Link href="/signup" passHref>
            <a>
              <button className={ui.buttonActionAlt + " " + ui.centerx + " " + ui.relative + " " + ui.dblock} style={{ width: 250, margin: '10px 0' }}>Get Started</button>
            </a>
          </Link>
          <Link href="/donate" passHref>
            <a>
              <button className={ui.buttonAction + " " + ui.centerx + " " + ui.relative + " " + ui.dblock} style={{ width: 250, margin: '10px 0' }}>Donate</button>
            </a>
          </Link>
        </div>

        <Footer background="var(--background-default)"/>
      </div>
    </>
  )
}
