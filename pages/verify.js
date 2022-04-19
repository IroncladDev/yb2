/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import ui from '../styles/ui.module.scss'
import Nav from '../components/nav'
import Fade from '../components/fade'
import Link from 'next/link'
import Footer from '../components/footer'
import Swal from '../scripts/client/modal';
export default function Verify() {
  Swal.fire({
    title: "Check your inbox",
    html: "We've sent you a confirmation email.  Before you start using YouBarter, you are required to verify your email.  If a week passes without account verification, we'll delete your unverified account and you can sign up again.",
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonText: "Resend verification email",
    showCancelButton: false,
    preConfirm: async () => {
      let emailRes = await fetch("/api/post/reverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        }
      }).then(r => r.json());
      if(emailRes.success){
        Swal.fire({
          title: "Email Resent",
          text: "We resent the email to your inbox."
        })
      }else{
        Swal.fire({
          title: "Failed to send email",
          text: emailRes.message
        })
      }
    }
  })
  return (<>
    <Head>
      <title>Verify your Account | YouBarter</title>
    </Head>
    <div>
      <Nav />
      <div className={ui.relcont} style={{ background: 'var(--background-default)' }}>
        
      </div>
      <Footer background="var(--background-default)" />
    </div>
  </>)
}

export function getServerSideProps({req, res}){
  if(req.cookies.sid && !req.cookies.verified){
    return {
      redirect: {
        destination: "/home"
      }
    }
  }else if(!req.cookies.verified && !req.cookies.sid){
    return {
      redirect: {
        destination: "/login"
      }
    }
  }else{
    return {
      props: {}
    }
  }
}