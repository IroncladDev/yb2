/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import styles from '../styles/pages/index.module.scss'
import ui from '../styles/ui.module.scss'
import Nav from '../components/nav'
import Footer from '../components/footer'
export default function Contact(props) {
  return (<>
    <Head>
      <title>Contact Us | YouBarter</title>
    </Head>
    <div>
      <Nav />
      <div className={ui.relcont} style={{ background: 'var(--background-default)', padding: '30px 0' }}>
        <h1 className={ui.textCenter} style={{ paddingTop: 'calc(var(--space-16) * 2)' }}>Contact Us</h1>
        <div key={Math.random()} className={styles.staffGrid + " " + ui.centerx + " " + ui.relative}>
          {props.team.map(x => (<div key={Math.random()} className={ui.box16 + " " + styles.mBox}>
            <img className={styles.mimg + " " + ui.centerx + " " + ui.relative} src={x.image} alt={`image of ${x.name}`} />
            <h2 className={styles.mname}>{x.name}</h2>
            <h3 className={styles.mtitle}>{x.title}</h3>
            <div className={styles.memail}><a href={"mailto:" + x.email}>{x.email}</a></div>
            <p className={styles.mDesc + " " + ui.textCenter}>{x.description}</p>
          </div>))}
        </div>

        <h2 className={ui.textCenter}>Any other issues?</h2>
        <p className={ui.blockParagraph + " " + ui.textCenter}>If there is anyt­hing else you would like to say, drop us an email at <a href="mailto:contact.youbarter@gmail.com">contact.youbarter@gmail.com</a></p>

        <p className={ui.blockParagraph + " " + ui.textCenter}><em>“Finally, all of you, have unity of mind, sympathy, brotherly love, a tender heart, and a humble mind.” - 1 Peter 3:8</em></p>
      </div>
      <Footer background="var(--background-default)" />
    </div>
  </>)
}

export function getServerSideProps() {
  return {
    props: {
      team: [{
        image: "/images/willie.jpeg",
        name: "Willie Ow",
        title: "CEO and Founder",
        email: "chirow2000@gmail.com",
        description: "Do not rouse the CEO unless you want to be suffocated with bear-hugs and dog kisses"
      },
      {
        image: "/images/rita.jpeg",
        name: "Rita Ow",
        title: "Co-Founder & Admin",
        email: "ritamaxhk@yahoo.com",
        description: "Rita is the appoi­nted Q&A mach­ine. If you have any parti­cular quest­ions about YouBa­rter, feel free to spam her inbox."
      }, {
        image: "/images/conner.png",
        name: "Conner Ow",
        title: "IT Support and Website Developer",
        email: "connerow1115@gmail.com",
        description: "Issues or sugges­tions on the webs­ite? Let me know. Finan­cial Issues? Call the bank."
      }, {
        image: "/images/haven.jpeg",
        name: "Haven Ow",
        title: "Admin & Scapegoat",
        email: "havenow0806@gmail.com",
        description: "Haven makes sure that all who use the site behave themselves. If you aren't acting nicely, she'll hunt you down."
      }]
    }
  }
}