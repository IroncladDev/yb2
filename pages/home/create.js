import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import styles from '../../styles/pages/create.module.scss';
import ui from '../../styles/ui.module.scss';
import { clientAuth } from '../../scripts/server/auth.js';
import { useState, useEffect, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Swal from '../../scripts/client/modal';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import ProfileNav from '../../components/profilenav.js';
import { hcSitekey, mapboxToken, keywords } from '../../public/vars.js';

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = mapboxToken;

export default function Create(props) {
  const user = JSON.parse(props.currentUser);
  const [result, setResult] = useState(false);
  let [tags, setTags] = useState([])
  let [tag, setTag] = useState("")
  const [cap, setCap] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const captchaRef = useRef(null)
  const formRef = useRef(null);
  const [showRes, setRes] = useState(false);
  const [docwidth, setDocWidth] = useState(0);

  const handleVerificationSuccess = (token, ekey) => {
    setCap(token);
    formRef.current.submit();
  };

  useEffect(() => {
    setDocWidth(window.innerWidth);
    window.addEventListener("resize", () => setDocWidth(window.innerWidth))
    if (!document.querySelector(".mapboxgl-ctrl-geocoder")) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: 'us',
        bbox: [-125.0011, 24.9493, -66.9326, 49.5904],
      });
      geocoder.addTo("#geocoder-container");
      geocoder.on('result', (e) => {
        console.log(e.result.center)
        setResult(e.result.center);
      })
    }
  }, [])

  return (<div>
  <Head><title>Create | YouBarter</title></Head>
    <div className={styles.homepageCore}>
      <div className={styles.bodyCont}>
        <form method="POST" action="/api/post/create" className={styles.createForm} ref={formRef} onSubmit={e => {
          e.preventDefault();
          if (tags.length === 0) {
            Swal.fire("Error", "Please add at least one tag to your good or service so that others can find it.");
          } else if (!result) {
            Swal.fire("Error", "Please select a location for your good or service or it will not show up on the map");
          } else if(description.length < 32){
            Swal.fire("Error", "Description must be at least 32 characters")
          }
          
          if(result && tags.length > 0 && title.length >= 8 && description.length >= 32) {
            console.log("All good")
            captchaRef.current.execute();
          }
        }}>
          <input type="hidden" name="h-captcha-response" value={cap} />
          <div className={ui.formLabel}>Title</div>
          <input className={ui.input} name="title" minLength={8} maxLength={64} placeholder="Give it a name" value={title} onChange={e => setTitle(e.target.value)} required />
          <div className={ui.formLabel}>Description</div>
          <p className={styles.descSmall}>Be sure to list any additional details.  No need for contact info.</p>
          <textarea className={ui.input} rows={4} name="description" placeholder="Describe your good/service in detail" minLength={32} maxLength={1024} value={description} onChange={e => setDescription(e.target.value)} required />
          <div className={ui.formLabel}>Location</div>
          <p className={styles.descSmall}>Enter the location of where the bartering service is at, otherwise, just enter your home address.</p>
          <div id="geocoder-container" className={styles.searchContainer}></div>
          <input type="hidden" name="coordinates" value={result} />
          <div className={ui.formLabel}>Tags</div>
          <div className={styles.tagWrapper}>
            <div className={styles.tags}>
              {tags.map(x => <div onClick={() => {
                setTags(tags.filter(y => y !== x));
              }} className={styles.tag} key={x}>{x}</div>)}
            </div>
            <input style={{display: (tags.length === 5 ? "none" : "block")}} placeholder="Add Tags" maxLength={25} className={styles.tagInput} onKeyUp={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && tag.length > 0 && tags.length < 5) {
                setTags([...new Set([...tags, tag])]);
                setTag("");
              }
            }} onChange={(e) => {
              setTag(e.target.value.replace(/\s/g, "-").replace(/[^a-z0-9\-]/g, ""));
              if (e.target.value.length > 0) setRes(true);
            }} value={tag} />
            <input name="tags" type="hidden" value={tags} />
            <div style={{display: (tags.length === 5 ? "none" : "block")}} className={styles.tagAdd} onClick={() => {
              if (tag.length > 0 && tags.length < 5) {
                setTags([...new Set([...tags, tag])]);
                setTag("");
              }
            }}>
              <span>+</span>
            </div>
          </div>
          {(tag.length > 0 && tags.length < 5) && <div className={styles.searchResults}>
            {props.keywords.sort((a, b) => a.localeCompare(b)).filter(x => x.match(new RegExp(tag, "ig"))).slice(0, 5).map((keyword) => <div key={keyword} className={styles.searchResult} onClick={e => {
              if (e.target.innerText.length > 0 && tags.length < 5) {
                setTags([...new Set([...tags, e.target.innerText])]);
                setTag("")
              }
            }} dangerouslySetInnerHTML={{ __html: keyword.replace(tag, `<strong>${tag}</strong>`) }}></div>)}
            <div className={styles.searchResult} onClick={(e) => {
              if (e.target.innerText.length > 0 && tags.length < 5) {
                setTags([...new Set([...tags, tag])]);
                setTag("")
              }
            }}>Add {tag}</div>
          </div>}
          <div className={ui.formLabel}>What are you offering?</div>
          <select name="gs" className={ui.buttonAction}>
            <option value="good">Good(s)</option>
            <option value="service">Service(s)</option>
          </select>
          <div className={ui.formLabel}>Create Listing</div>
          <p className={styles.descSmall}>Double-check everything and go!</p>
          <HCaptcha
            sitekey={hcSitekey}
            onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
            ref={captchaRef}
            size="invisible"
          />
          <button className={ui.buttonAction}>Submit</button>
        </form>
      </div>
      <ProfileNav user={user} page={"create"} />
    </div>
  </div>)
}

export async function getServerSideProps({ req, res }) {
  let userData = await clientAuth(req);
  if (userData) {
    return {
      props: {
        currentUser: JSON.stringify(userData),
        keywords
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