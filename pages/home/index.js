/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import styles from '../../styles/pages/home.module.scss';
import ui from '../../styles/ui.module.scss';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { clientAuth } from '../../scripts/server/auth.js';
import { useState, useEffect, useRef } from 'react';
import * as Icon from 'react-feather';
import ProfileNav from '../../components/profilenav.js';

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoiaXJvbmNsYWRkZXYiLCJhIjoiY2wxbnFwa3cyMHg2azNqczk2Ymd0bzd0NSJ9.ufa0YTxIlJfz0UYexTMsbw';

function CheckboxGroup(props) {
  const [fields, setFields] = useState(props.fields.reduce((obj, item) => ({
    ...obj,
    [item]: false
  }), {}));
  return (<div className={styles.checkboxGroup}>
    {props.fields.map((field) => <label key={field} className={styles.checkboxField}>
      <input type="checkbox" checked={fields[field]} onChange={(e) => {
        setFields({
          ...fields,
          [field]: e.target.checked
        });
        props.updateFields({
          ...fields,
          [field]: e.target.checked
        })
      }} />
      <span className={styles.checkmark}></span>
      {field}
    </label>)}
  </div>)
}


function CollapseGroup(props) {
  const [closed, setClosed] = useState('open' in props ? false : true);
  return (<div className={styles.collapseGroup}>
    <div className={styles.collapseGroupHeader + " " + (closed ? styles.collapseClosed : styles.collapseOpen)} onClick={() => setClosed(!closed)}>
      <div className={styles.collapseGroupHeaderText}>{props.title}</div>
      <div className={styles.collapseGroupHeaderIcon}>
        <Icon.ChevronDown />
      </div>
    </div>
    <div className={styles.collapseGroupContent + " " + (closed ? styles.collapseClosed : styles.collapseOpen)}>
      {props.children}
    </div>
  </div>)
}

function SearchEngine(props) {
  const [filter, setFilter] = useState({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('oldest');
  const [showRes, setRes] = useState(false);
  useEffect(() => {
    console.log(filter)
  }, [filter])
  return (<div className={styles.searchEngine + " " + (props.showSearch ? styles.showSearch : styles.hideSearch)}>
    <div id="geocoder-container" className={styles.searchContainer}></div>

    <div className={styles.collapseContainer}>
      <CollapseGroup title="Categories" open>
        <div className={ui.formLabel}>Search</div>
        <input className={ui.input} placeholder="Food, Clothing, etc" style={{ width: '100%' }} value={search} onChange={e => {
          setSearch(e.target.value);
          if (e.target.value.length > 0) setRes(true);
        }} />
        {showRes && <div className={styles.searchResults}>
          {props.keywords.sort((a, b) => a.localeCompare(b)).filter(x => x.match(new RegExp(search, "ig"))).slice(0, 5).map((keyword) => <div key={keyword} className={styles.searchResult} onClick={e => {
            setSearch(e.target.innerText);
            props.runSearch(search);
            setRes(false);
          }} dangerouslySetInnerHTML={{ __html: keyword.replace(search, `<strong>${search}</strong>`) }}></div>)}
          <div className={styles.searchResult} onClick={() => {
            setSearch(search);
            props.runSearch(search);
            setRes(false)
          }}>filter with {search}...</div>
        </div>}
      </CollapseGroup>
      <CollapseGroup title="Filter">
        <CheckboxGroup fields={['goods', 'services']} updateFields={setFilter} />
      </CollapseGroup>
      <CollapseGroup title="Result Limit">
        <div className={ui.formLabel}>No. of results on the map</div>
        <input className={ui.input} type="number" value={props.numResults} onChange={e => props.setNumResults(e.target.value)} style={{ width: '100%' }} />
      </CollapseGroup>
      <CollapseGroup title="Sort By">
        <select className={ui.buttonAction} value={sort} style={{ width: '100%' }} onChange={e => {
          setSort(e.target.value);
          props.setSort(e.target.value);
        }}>
          <option value="oldest">Oldest</option>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
        </select>
      </CollapseGroup>
    </div>

  </div>)
}

function MapCore(props) {
  return (<div className={styles.mapCore}>
    <div id="mapid" className={styles.mapboxGl}></div>
    <div className={styles.viewPopup + " " + (props.viewItem ? styles.showViewItem : styles.hideViewItem)}></div>
  </div>)
}



export default function Dashboard(props) {
  const user = JSON.parse(props.currentUser);

  const [showSearch, setShowSearch] = useState(true);
  const [loc, setLoc] = useState({});
  const [viewItem, setViewItem] = useState(false);
  const [numResults, setNumResults] = useState(50);

  const navigateToPoint = (id) => {
    //setViewItem(id)
  }

  const runSearch = (search) => {

  }

  const setSort = (sort) => {

  }

  //Create the mapbox map
  useEffect(() => {
    const map = (new mapboxgl.Map({
      container: "mapid",
      style: "mapbox://styles/mapbox/light-v10",
      zoom: 0,
      pitch: 15,
      maxBounds: [
        //ymax, xmin
        [-125.0011, 24.9493], //sw
        //ymin, xmax
        [-66.9326, 49.5904], //ne
      ]
    }));

    // Load the marker icon
    map.loadImage('/icons/marker.png', (error, image) => {
      if (error) throw error;
      map.addImage('marker', image);
    });

    // Create the map
    map.on('load', async () => {
      map.addSource('data', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'properties': {
                'id': "1",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.038659, 38.931567]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "2",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.003168, 38.894651]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "3",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.090372, 38.881189]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "4",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.111561, 38.882342]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "5",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.052477, 38.943951]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "5",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.031706, 38.914581]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "6",
                'icon': 'marker',
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.020945, 38.878241]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': "7",
                'icon': 'marker'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-77.007481, 38.876516]
              }
            }
          ]
        }
      });
      map.addLayer({
        'id': 'data',
        'type': 'symbol',
        'source': 'data',
        'layout': {
          'icon-image': '{icon}',
          'icon-allow-overlap': true,
          "icon-size": ['interpolate', ['linear', 2], ['zoom'], 0, 0.5, 22, 1]
        }
      });
      map.on('click', 'data', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        let id = e.features[0].properties.id;
        /*while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }*/
        map.flyTo({
          center: coordinates,
          zoom: 12.5
        })
        navigateToPoint(id)
      });
      map.on('mouseenter', 'data', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'data', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    // Define Map Controls
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    // Add the geocoder
    if (!document.querySelector(".mapboxgl-ctrl-geocoder")) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: 'us',
        bbox: [-125.0011, 24.9493, -66.9326, 49.5904],
      });
      document.querySelector("#geocoder-container").append(geocoder.onAdd(map));
    }
    if (document.querySelector(".mapboxgl-ctrl-attrib")) {
      document.querySelector(".mapboxgl-ctrl-attrib").remove();
    }

  }, []);

  useEffect(() => {
    if (showSearch) {
      document.querySelector(".mapboxgl-ctrl-logo").style.display = "none";
    } else {
      document.querySelector(".mapboxgl-ctrl-logo").style.display = "block";
    }
  }, [showSearch])

  return (<div>
    <Head>
      <title>Home | YouBarter</title>
      <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <div className={styles.homepageCore}>
      <MapCore viewItem={viewItem} setViewItem={setViewItem} />
      <ProfileNav user={user} page={"home"} />
    </div>
    <SearchEngine showSearch={showSearch} keywords={props.keywords} runSearch={runSearch} numResults={numResults} setNumResults={setNumResults} setSort={setSort} />
    <div className={styles.showSearchButton + " " + (showSearch ? styles.showSearch : styles.hideSearch)} onClick={() => setShowSearch(!showSearch)}>
      <Icon.ChevronRight />
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