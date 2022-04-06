import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/pages/index.module.css'
import ui from '../styles/ui.module.css'
import Swal from '../scripts/client/modal';

export default function Home() {
  Swal.fire({
    title: "Test Modal",
    text: "This is a test modal text with lots of content just to fill up space with no actual purpose really",
    showCancelButton: true,
    showDenyButton: true,
    showCloseButton: true
  })
  return (
    <>
      <Head>
        <title>Home | YouBarter</title>
      </Head>
      <div>
        <h1>Header One</h1>
        <h2>Header Two</h2>
        <h3>Header Three</h3>
        <h4>Header Four</h4>
        <h5>Header Five</h5>
        <h6>Header Six</h6>

        <button className={ui.buttonAction}>Action</button>
        <button className={ui.buttonCancel}>Cancel</button>
        <button className={ui.buttonDanger}>Danger</button>

        <select className={ui.buttonAction}>
          <option>Option One</option>
          <option>Option Two</option>
          <option>Option Three</option>
          <option>Option Four</option>
        </select>

        <div className={ui.box4}>
          compact box 4
        </div>
        <div className={ui.box6}>
          compact box 6
        </div>
        <div className={ui.box8}>
          compact box 8
        </div>
        <div className={ui.box16}>
          compact box 16
        </div>

        <p className={ui.par}>This is a paragraph of random words in place of lorem ipsum ni case you&apos;ve heard.  It goes on and on at no one&apos; word, forever and ever to no accord &apos;cause This is a paragraph of random words in place of lorem ipsum ni case you&apos;ve heard.  It goes on and on at no one&apos; word, forever and ever to no accord &apos;cause This is a paragraph of random words in place of lorem ipsum ni case you&apos;ve heard.  It goes on and on at no one&apos; word, forever and ever to no accord &apos;cause This is a paragraph of random words in place of lorem ipsum ni case you&apos;ve heard.  It goes on and on at no one&apos; word, forever and ever to no accord &apos;cause This is a paragraph of random words in place of lorem ipsum ni case you&apos;ve heard.  It goes on and on at no one&apos; word, forever and ever to no accord &apos;cause </p>

        <hr/>

        <input className={ui.input}/>
        <textarea className={ui.input}></textarea>
      </div>
    </>
  )
}
