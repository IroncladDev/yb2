import ui from '../styles/ui.module.css';
import Head from 'next/head';
import styles from '../styles/pages/login.module.css'
import Link from 'next/link'
import { useState, useRef } from 'react';
import Swal from '../scripts/client/modal';

function FormBG() {
  return (<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className={styles.layer} preserveAspectRatio="none" style={{ borderRadius: 5, background: 'var(--accent-primary-flash)' }}>
    <defs>
      <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="rgb(94, 139, 126)"></stop>
        <stop offset="1" stopColor="rgb(120, 172, 157)"></stop>
      </linearGradient>
    </defs>
    <path d="M 0 600 L 0 200 C 33.333 300 83.333 366.667 150 400 C 216.667 433.333 233.333 466.667 200 500 C 233.333 466.667 266.667 466.667 300 500 C 366.667 566.667 466.667 600 600 600 L 0 600" fill="url(#grad1)"></path>
    <path d="M 0 0 C 133.333 0 300 33.333 500 100 C 533.333 100 566.667 83.333 600 50 C 600 83.333 616.667 116.667 650 150 C 750 216.667 800 266.667 800 300 L 800 0 L 0 0" style={{ fill: "rgb(94, 139, 126)" }}></path>
  </svg>)
}

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

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const formRef = useRef(null);

  const forgot = async () => {
    const { value: email } = await Swal.fire({
      title: "Worry not, my friend",
      text: "You might've forgotten your password but we haven't forgotten you! Enter your email and we'll send you a reset link.",
      input: "email",
      showCancelButton: true
    });
    if (email) {
      let resetEmail = await fetch("/api/post/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          email
        })
      }).then(r => r.json());
      if(resetEmail.success){
        Swal.fire({
          title: "Email Sent!",
          text: "We sent a confirmation email to " + email + ".  Please allow up to thirty minutes and check your spam folder.",
        })
      }else{
        Swal.fire({
          title: "Failed",
          text: resetEmail.message
        })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = [...errors];

    let userExistsByUsername = await fetch("/api/get/user?username=" + username).then(r => r.json());
    let userExistsByEmail = await fetch("/api/get/user?email=" + username).then(r => r.json());
    if (userExistsByUsername || userExistsByEmail) {
      errs = errs.filter(x => x !== "User does not exist");
      let testPassword = !!(await fetch("/api/post/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          login: username,
          password
        })
      }).then(r => r.json()));
      if(testPassword){
        errs = errs.filter(x => x !== "Incorrect Password")
      }else{
        errs.push("Incorrect Password");
      }
    }else{
      errs.push("User does not exist");
    }

    let passwordCorrect = await fetch("/api/post/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({
        password,
        login: username
      })
    }).then(r => r.json())

    if(passwordCorrect.success){
      errs = errs.filter(x => x !== "Password Incorrect");
    }else{
      errs.push("Password Incorrect");
    }

    setErrors([...new Set(errs)])

    if (errs.length <= 0) {
      formRef.current.submit();
    }
  };




  return (<>
    <Head>
      <title>Log In | YouBarter</title>
    </Head>
    <div className={ui.relcont}>
      <div className={ui.overlayGrid}>
        <div className={ui.overlayer} style={{ background: 'var(--accent-primary-flash)', height: '100vh !important' }}>
          <BackSvg />
        </div>

        <div className={ui.overlayer}>
          <div className={styles.form + " " + ui.centerxy + " " + ui.absolute}>
            <div className={styles.formIntro}>
              <FormBG />
              <div className={styles.layer + " " + ui.relative}>
                <div className={ui.centerxy + " " + ui.relative}>
                  <h3 className={ui.textCenter}>Welcome Back!</h3>
                  <p className={ui.textCenter} style={{ padding: '5px 20px' }}>We&apos;ve missed you!  Thanks for being a part of our community!</p>
                  <Link href="/signup"><a>
                    <button className={ui.buttonAction + " " + ui.dblock + " " + ui.centerx + " " + ui.relative} style={{ width: 200 }}>Sign Up</button>
                  </a></Link>
                  <Link href="/donate"><a>
                    <button className={ui.buttonAction + " " + ui.dblock + " " + ui.centerx + " " + ui.relative + " " + ui.mt8} style={{ width: 200 }}>Donate</button>
                  </a></Link>
                </div>
              </div>
            </div>

            <form method="POST" action="/api/post/login" className={styles.formBody} onSubmit={handleSubmit} ref={formRef}>
              <h3 className={ui.textCenter}>Log In</h3>
              <p className={ui.textCenter}>Don&apos;t have an account? <Link href="/signup"><a>Sign Up</a></Link></p>
              <div className={ui.formLabel}>Username or Email</div>
              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="johndoe@gmail.com" name="username" id="username" autoComplete='off' onChange={e => setUsername(e.target.value)} value={username} required={true} />

              <div className={ui.formLabel}>Password</div>

              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="Nice and strong!" name="password" type="password" id="password" autoComplete='off' onChange={e => setPassword(e.target.value)} value={password} required={true} />

              {errors.length > 0 &&
                <div className={styles.error}>
                  <strong style={{ color: 'var(--accent-negative-dimmest)', fontWeight: 500 }}>Please try again</strong>
                  <ul className={styles.elist}>
                    {errors.map(x => <li key={Math.random()}>{x}</li>)}
                  </ul>
                </div>}
              <button type="submit" className={ui.buttonAction + " " + ui.dblock + " " + ui.w100p} style={{ marginBottom: 10 }}>Log In</button>
              <a href="#" onClick={forgot}>Forgot Password</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>)
}