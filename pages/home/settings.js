/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import styles from '../../styles/pages/settings.module.scss';
import ui from '../../styles/ui.module.scss';
import { clientAuth } from '../../scripts/server/auth.js';
import { useState, useEffect, useRef } from 'react';
import ProfileNav from '../../components/profilenav.js';
import router from 'next/router';
import Swal from '../../scripts/client/modal';

export default function Dashboard(props) {
  const user = JSON.parse(props.currentUser);

  const [bs4, setBs4] = useState("");
  const [firstName, setFirstName] = useState(user.displayName.split` `[0] || user.username);
  const [lastName, setLastName] = useState(user.displayName.split` `[1] || "");
  const [bio, setBio] = useState(user.bio);
  const deleteAccountRef = useRef(null);

  const getBs4 = (e) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onload = async (upload) => {
        if (file) {
          setBs4(upload.target.result);
        }
      }
      reader.readAsDataURL(file);
    }
  }

  const updateProfile = () => {
    if (firstName.length < 2) {
      Swal.fire({
        title: "Almost, but not quite.",
        text: "First name must be at least 2 characters long",
      });
      return;
    } else if (lastName.length < 2) {
      Swal.fire({
        title: "Almost, but not quite.",
        text: "Last name must be at least 2 characters long",
      });
      return;
    } else if (bio.length < 16) {
      Swal.fire({
        title: "Almost, but not quite.",
        text: "Bio must be at least 16 characters long",
      });
      return;
    }

    fetch("/api/post/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*",
      },
      body: JSON.stringify({
        firstName, lastName, bio
      })
    }).then(r => r.json()).then(data => {
      if (data.success) {
        router.push(window.location.pathname)
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "There was an error updating your profile image",
        });
      }
    });
  }

  const deleteAccount = () => {
    const randText = Math.random().toString(36).slice(2)
    Swal.fire({
      title: "Are you sure?",
      html: "Warning, this action is irreversable!  Please type <b>" + randText + "</b> to confirm account deletion.",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      preConfirm: (code) => {
        if (code === randText) {
          deleteAccountRef.current.submit()
        } else {
          Swal.fire({
            title: "Incorrect Code",
            text: "Account was not deleted since the code you entered was incorrect.  Your account lives to see another day!",
          });
        }
      }

    })
  };


  useEffect(() => {
    if (bs4) {
      fetch("/api/post/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*",
        },
        body: JSON.stringify({
          image: bs4,
        })
      }).then(r => r.json()).then(data => {
        if (data.success) {
          setBs4("")
          router.push(window.location.pathname)
        } else {
          Swal.fire({
            title: "Error",
            text: data.message || "There was an error updating your profile image",
          });
        }
      });
    }
  }, [bs4])

  return (<div>
    <Head>
      <title>Settings | YouBarter</title>
    </Head>
    <div className={styles.homepageCore}>
      <div className={styles.bodyCont}>

        <div className={ui.box8 + " " + styles.formElement + " " + styles.formFlexHead}>
          <div className={styles.formFlexHeadLeft}>
            <div className={styles.profileImageOverlay} style={{ backgroundImage: "url(" + user.image + ")" }}>
              {bs4 && <div className={styles.profileImageLoader}></div>}
            </div>
            <input type="file" onChange={getBs4} accept="image/*" id="upload-profile-image" style={{ display: 'none' }} />
            <label htmlFor="upload-profile-image" className={ui.buttonAction} style={{ display: 'inline-block', marginTop: 5 }}>upload</label>
          </div>

          <div className={styles.formFlexHeadRight}>
            <div className={ui.formLabel} style={{ marginTop: 0 }}>First Name</div>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className={ui.input} placeholder="John" maxLength={16} />
            <div className={ui.formLabel}>Last Name</div>
            <input value={lastName} onChange={e => setLastName(e.target.value)} className={ui.input} placeholder="Doe" maxLength={16} />
            <div className={ui.formLabel}>Bio / About Me</div>
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={128} className={ui.input} placeholder="I am me..." rows={3} />
            <button className={ui.buttonAction} style={{ float: 'right' }} onClick={updateProfile}>Save</button>
          </div>
        </div>

        <form method="POST" action="/api/post/delacc" className={ui.box8 + " " + styles.formElement + " " + styles.delForm} ref={deleteAccountRef} onSubmit={e => e.preventDefault()}>
          <h4>Account Deletion</h4>
          <div className={ui.formLabel}>Confirm Password</div>
          <input name="password" className={ui.input} placeholder="••••••••" autoComplete="off" type="password"/>
          <div>
            <button className={ui.buttonDanger} style={{ float: 'right' }} onClick={deleteAccount}>Delete</button>
          </div>
        </form>

      </div>
      <ProfileNav user={user} page={"settings"} />
    </div>
  </div>)
}

export async function getServerSideProps({ req }) {
  let userData = await clientAuth(req);
  if (userData) {
    return {
      props: {
        currentUser: JSON.stringify(userData)
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