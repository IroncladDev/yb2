import ui from '../styles/ui.module.scss';
import Head from 'next/head';
import styles from '../styles/pages/login.module.scss'
import Link from 'next/link';
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from 'react';
import Swal from '../scripts/client/modal';
const stripePromise = loadStripe(
  "pk_test_51Jz557KYWZlpKJ1WEfNprGtV4mUEKolWM9TVSvwN42f6zA2QYsMeCwzkUhrVf1lfVVTFh0dcJYY9tLrcPADIgy5l00djvYVbqH"
);

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

export default function Donate() {
  useEffect(() => {
    (async () => {
      const stripe = await stripePromise;
      Swal.fire({
        title: "Enter Amount",
        text: "Thanks for offering us a donation!  Please enter the amount (in USD) of how much you would like to donate.",
        input: "number",
        inputAttributes: {
          min: 1,
        },
        showCancelButton: true,
        cancelButtonText: "<a href='/'>Cancel</a>",
        preCancel: () => {
          location.href = "/";
        },
        preConfirm: (value) => {
          Swal.fire({
            title: "Loading...",
            text: "We're working on it.  Wait a few seconds...",
            showConfirmButton: false
          })
          var stripe = Stripe("pk_live_51Jz557KYWZlpKJ1WHB9TE7jt7v2CWjJF38bvRNzNaam4QP4CnQsqneZvwKiXPBt8tNkchgHaCIzX2eF1v2tadQjS00Wa49DQik")
          fetch("/api/post/payment", {
            headers: { 'Content-Type': 'application/json' },
            method: "POST",
            body: JSON.stringify({
              "product": {
                "name": "Donation",
                "amount": value,
                "quantity": 1
              }
            })
          })
            .then(r => r.json())
            .then(session => {
              return stripe.redirectToCheckout({ sessionId: session.id });
            })
            .then(result => {
              if (result.error) {
                Swal.fire({
                  title: "Internal Server Error",
                  text: "Whoops, there was an error with your request.  Please try again or contact support."
                })
              }
            })
            .catch(function (error) {
              Swal.fire({
                title: "Internal Server Error",
                text: "Whoops, there was an error with your request.  Please try again or contact support."
              })
            });
        }
      })
    })();
  }, [])
  return (<>
    <Head>
      <title>Donate | YouBarter</title>
    </Head>
    <div className={ui.relcont}>
      <div className={ui.overlayGrid}>
        <div className={ui.overlayer} style={{ background: 'var(--accent-primary-flash)', height: '100vh !important' }}>
          <BackSvg />
        </div>


      </div>
    </div>
  </>)
}