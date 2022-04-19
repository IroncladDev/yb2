/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/index.module.scss'
import ui from '../styles/ui.module.scss'
import Nav from '../components/nav'
import Fade from '../components/fade'
import Link from 'next/link'
import Footer from '../components/footer'
export default function About() {
  return (<>
    <Head>
      <title>About Us | YouBarter</title>
    </Head>
    <div>
      <Nav />
      <div className={ui.relcont} style={{ background: 'var(--background-default)' }}>
        <h1 className={ui.textCenter} style={{ paddingTop: 'calc(var(--space-16) * 2)' }}>About Us</h1>
        <Fade>
          <p className={ui.blockParagraph}>YouBarter is a non-profit organization where everyone can share and help in their own community. We try to keep our expenses at a minimum so no one has to pay a membership fee, but we do ask you to kindly contribute to our expenses for running this site.</p>
        </Fade>
        <Fade>
          <p className={ui.blockParagraph}>The idea of bartering is not new to us and we may not have the immediate need for it. But our goal is to provide individuals a master list of people that are willing to barter when times get tough. In times of uncertainty, we don’t know when there will be another financial crisis, catastrophic weather event, or simply a difficult situation in our lives.<hr /></p>
        </Fade>

        <Fade>
          <p className={ui.blockParagraph + " " + ui.textCenter}><em>“Behold, how good and how pleasant it is when brothers dwell in unity.” - Psalm 133:1</em></p>
        </Fade>
        <Fade>
          <Link href="/signup" passHref>
            <a>
              <button className={ui.buttonActionAlt + " " + ui.centerx + " " + ui.relative + " " + ui.dblock} style={{ width: 250, margin: '10px 0' }}>Sign Up</button>
            </a>
          </Link>
        </Fade>
      </div>
      <Footer background="var(--background-default)" />
    </div>
  </>)
}