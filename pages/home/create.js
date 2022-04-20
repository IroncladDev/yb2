import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import styles from '../../styles/pages/create.module.scss';
import ui from '../../styles/ui.module.scss';
import { clientAuth } from '../../scripts/server/auth.js';
import { useState, useEffect, useRef } from 'react';
import * as Icon from 'react-feather';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import ProfileNav from '../../components/profilenav.js';

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoiaXJvbmNsYWRkZXYiLCJhIjoiY2wxbnFwa3cyMHg2azNqczk2Ymd0bzd0NSJ9.ufa0YTxIlJfz0UYexTMsbw';

export default function Create(props) {
  const user = JSON.parse(props.currentUser);
  const [result, setResult] = useState(false);
  let [tags, setTags] = useState([])
  let [tag, setTag] = useState("")

  useEffect(() => {
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
    <div className={styles.homepageCore}>
      <div className={styles.bodyCont}>
        <form method="POST" action="/api/post/create" className={styles.createForm}>
          <div className={ui.formLabel}>Title</div>
          <input className={ui.input} name="title" placeholder="Give it a name" />
          <div className={ui.formLabel}>Description</div>
          <textarea className={ui.input} rows={4} name="description" placeholder="Describe your good/service in detail" />
          <div className={ui.formLabel}>Location</div>
          <p className={styles.descSmall}>Enter the location of where the bartering service is at, otherwise, just enter your home address.</p>
          <div id="geocoder-container" className={styles.searchContainer}></div>
          <input type="hidden" name="coordinates" value={result} />
          <div className={styles.formLabel}>Tags</div>
          <div className={styles.tagWrapper}>
            <div className={styles.tags}>
              {tags.map(x => <div onClick={() => {
                setTags(tags.filter(y => y !== x));
              }} className={styles.tag} key={x}>{x}</div>)}
            </div>
            <input placeholder="Add Tags" maxLength={25} className={styles.tagInput} onKeyUp={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && tag.length > 0 && tags.length < 5) {
                setTags([...new Set([...tags, tag])]);
                setTag("");
              }
            }} onChange={(e) => {
              setTag(e.target.value.replace(/\s/g, "-").replace(/[^a-z0-9\-]/g, ""))
            }} value={tag} />
            <input name="tags" type="hidden" value={tags}/>
          </div>
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
        keywords: [
          "food",
          "clothing",
          "electronics",
          "furniture",
          "body",
          "livestock",
          "toys",
          "baby",
          "health",
          "art",
          "storage",
          "other",
          "construction",
          "agriculture",
          "books",
          "education",
          "babysitting",
          "haircuts",
          "software",
          "hardware",
          "delivery",
          "transportation",
          "utitlities",
          "rentals",
          "design",
          "maintenance",
          "cleaning",
          "mechanics",
          "carpentry",
          "plumbing",
          "tutoring",
          "crafts",
          "labor",
          "painting",
          "accessories",
          "tools",
          "demolition",
          "repair",
          "installation",
          "pets",
          "medical",
          "beauty",
          "garden",
          "pest control",
        ],
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