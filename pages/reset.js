/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import ui from '../styles/ui.module.scss'
import Nav from '../components/nav'
import Fade from '../components/fade'
import Link from 'next/link'
import Footer from '../components/footer'
import Swal from '../scripts/client/modal';
import { User } from '../scripts/server/mongo.js'
export default function Verify(props) {
  Swal.fire({
    title: "Reset your Password",
    html: "Enter your new password and then you will be redirected to log in.",
    input: "password",
    inputPlaceholder: "make it strong",
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonText: "Done",
    showCancelButton: false,
    preConfirm: (password) => {
      if (password.length < 8) {
        Swal.showValidationMessage(
          `Password must be at least eight characters`
        )
      } else if (!/[0-9]/.test(password)) {
        Swal.showValidationMessage(
          `Password must have at least one number`
        )
      } else if (!/[^a-z0-9]/i.test(password)) {
        Swal.showValidationMessage(
          `Password must have at least one special character`
        )
      } else {
        fetch("/api/post/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "accept": "*/*"
          },
          body: JSON.stringify({
            password,
            token: props.token
          })
        }).then(r => r.json()).then(data => {
          if (data.success) {
            Swal.fire({
              title: "Success!",
              text: "You will be redirected shortly.",
              timer: 2000,
              timerProgressBar: true,
              willClose: () => {
                location.href = "/login";
              },
              showConfirmButton: false,
              showCancelButton: false,
            })
          } else {
            Swal.fire({
              title: "Internal Error",
              text: data.message
            })
          }
        })
      }
    }
  })
  return (<>
    <Head>
      <title>Reset Password | YouBarter</title>
    </Head>
    <div>
      <Nav />
      <div className={ui.relcont} style={{ background: 'var(--background-default)' }}>

      </div>
      <Footer background="var(--background-default)" />
    </div>
  </>)
}

export async function getServerSideProps({ req, res, query }) {
  let findUser = await User.findOne({ sid: query.sid })
  if (findUser) {
    return {
      props: {
        token: query.sid
      }
    }
  } else {
    return {
      redirect: {
        destination: "/login"
      }
    }
  }
}