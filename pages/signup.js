import ui from '../styles/ui.module.scss';
import Head from 'next/head';
import styles from '../styles/pages/login.module.scss'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { hcSitekey } from '../public/vars.js';
import getCountry from '../scripts/client/country'

function TRow(props) {
  const [checked, setChecked] = useState(false);
  const [loc, setLoc] = useState({});
  const handleCheck = (e) => {
    setChecked(e.target.checked);
  }
  useEffect(() => {
    let ch = props.termsChecked;
    ch[props.num] = checked;
    props.setTerms(ch);
    if (!ch.some(x => !x)) {
      props.setTos(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])
  return (<div className={styles.tosrow}>
    <input type="checkbox" onChange={handleCheck} checked={checked}/>
    <p>{props.children}</p>
  </div>)
}

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

function Tos(props) {
  return (<div style={{ display: props.display ? "block" : "none" }} className={styles.tos}>
    <h2>Rules and Statements</h2>
    <p>Please read and agree to follow each rule or statement before signing up</p>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={0} setTos={props.setTos}>1. Keep everything on the website clean.  Please do not post inappropriate content, bad words, or post illegal goods/services.</TRow>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={1} setTos={props.setTos}>2. Be honest.  This platform is built on integrity and honesty.  If someone reports you for not keeping a promise or refusing to do as you&apos;ve posted on the site, we will remove your listing.</TRow>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={2} setTos={props.setTos}>3. We are not responsible for anyone not doing what they say.  The furthest action we will take is unlisting the person&apos;s service and/or removing them from the site.  We will not refund, pay, or take responsibility for anything you might have lost.</TRow>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={3} setTos={props.setTos}>4. Agree to our <a href="/terms" target="_blank" rel="noreferrer">Terms</a> and <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> before you proceed.</TRow>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={4} setTos={props.setTos}>5. Use common sense - just because something isn&apos;t listed here doesn&apos;t mean you can break it.  Don&apos;t attempt to find a flaw in the wording and use it to your advantage.</TRow>
    <TRow termsChecked={props.termsChecked} setTerms={props.setTerms} num={5} setTos={props.setTos}>6. Thanks for joining us, please check this rule to continue.</TRow>
  </div>)
}

export default function Signup() {
  const [cap, setCap] = useState("");
  const [showTos, setTos] = useState(false);
  const [termsChecked, setTerms] = useState([false, false, false, false, false, false]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conf, setConf] = useState("");
  const [errors, setErrors] = useState([]);
  const captchaRef = useRef(null)
  const formRef = useRef(null);

  const handleVerificationSuccess = (token, ekey) => {
    setCap(token);
    setTos(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = [...errors];

    let userExists = (await fetch("/api/get/user?username=" + username).then(r => r.json())) || (await fetch("/api/get/user?email=" + username).then(r => r.json()));

    if(userExists){
      errs.push("Username or email already exists");
    }

    if(getCountry() !== "United States of America"){
      errs.push("YouBarter is currently only accessible and usable in the United States of America.")
    }

    if(username.length < 3){
      errs.push("Username must be at least three characters");
    }else{
      errs = errs.filter(x => x !== "Username must be at least three characters");
    }

    if(password.length < 8){
      errs.push("Password must be at least eight characters");
    }else{
      errs = errs.filter(x => x !== "Password must be at least eight characters");
    }

    if(!/[0-9]/.test(password)){
      errs.push("Password must contain at least one number");
    }else{
      errs = errs.filter(x => x !== "Password must contain at least one number");
    }

    if(!/[^a-z0-9]/i.test(password)){
      errs.push("Password must contain at least one special character");
    }else{
      errs = errs.filter(x => x !== "Password must contain at least one special character");
    }

    if(password !== conf){
      errs.push("Passwords must match");
    }else{
      errs = errs.filter(x => x !== "Passwords must match");
    }

    setErrors([...new Set(errs)])
    
    if (errs.length === 0) {
      captchaRef.current.execute();
    }
  };
  const submitForm = () => {
    setTos(false);
    formRef.current.submit();
  }




  return (<>
    <Head>
      <title>Sign Up | YouBarter</title>
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
                  <h3 className={ui.textCenter}>Welcome to YouBarter!</h3>
                  <p className={ui.textCenter} style={{ padding: '5px 20px' }}>We are a nonprofit organization that focuses on serving and helping each other out.</p>
                  <Link href="/about"><a>
                    <button className={ui.buttonAction + " " + ui.dblock + " " + ui.centerx + " " + ui.relative} style={{ width: 200 }}>Read More</button>
                  </a></Link>
                  <Link href="/donate"><a>
                    <button className={ui.buttonAction + " " + ui.dblock + " " + ui.centerx + " " + ui.relative + " " + ui.mt8} style={{ width: 200 }}>Donate</button>
                  </a></Link>
                </div>
              </div>
            </div>

            <form method="POST" action="/api/post/signup" className={styles.formBody} onSubmit={handleSubmit} ref={formRef}>
              <input type="hidden" value={cap} name="h-captcha-response" />
              <h3 className={ui.textCenter}>Sign Up</h3>
              <p className={ui.textCenter}>Already have an account? <Link href="/login"><a>Log In</a></Link></p>
              <div className={ui.formLabel}>Username</div>

              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="JohnDoe" name="username" id="username" autoComplete='off' onChange={e => setUsername(e.target.value)} value={username} required={true}/>

              <div className={ui.formLabel}>Email Address</div>

              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="johndoe@gmail.com" name="email" id="email" autoComplete='off' type=
              "email" onChange={e => setEmail(e.target.value)} value={email} required={true}/>

              <div className={ui.formLabel}>Password</div>

              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="Nice and strong!" name="password" type="password" id="password" autoComplete='off' onChange={e => setPassword(e.target.value)} value={password} required={true}/>

              <div className={ui.formLabel}>Confirm Password</div>

              <input className={ui.input + " " + ui.dblock + " " + ui.w100p} placeholder="We won't peek!" name="password2" type="password" id="password2" autoComplete='off' onChange={e => setConf(e.target.value)} value={conf} required={true}/>

              <HCaptcha
                sitekey={hcSitekey}
                onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                ref={captchaRef}
                size="invisible"
              />
              {errors.length > 0 &&
              <div className={styles.error}>
                <strong style={{ color: 'var(--accent-negative-dimmest)', fontWeight: 500 }}>Please try again</strong>
                <ul className={styles.elist}>
                  {errors.map(x => <li key={Math.random()}>{x}</li>)}
                </ul>
              </div>}
              <button type="submit" className={ui.buttonAction + " " + ui.dblock + " " + ui.w100p}>Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Tos display={showTos} termsChecked={termsChecked} setTerms={setTerms} setTos={submitForm} />
  </>)
}