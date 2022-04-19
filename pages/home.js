import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import styles from '../styles/pages/home.module.scss';
import ui from '../styles/ui.module.scss';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { clientAuth } from '../scripts/server/auth.js';
import { useState, useEffect } from 'react';

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1IjoiaXJvbmNsYWRkZXYiLCJhIjoiY2wxbnFwa3cyMHg2azNqczk2Ymd0bzd0NSJ9.ufa0YTxIlJfz0UYexTMsbw';

function SearchEngine(props) {
  return (<div className={styles.searchEngine + " " + (props.showSearch ? styles.showSearch : styles.hideSearch)}>
    <div id="geocoder-container"></div>
  </div>)
}

function MapCore(props) {
  return (<div className={styles.mapCore}>
    <div id="mapid" className={styles.mapboxGl}></div>

    <SearchEngine showSearch={props.showSearch}/>
    <div className={styles.showSearchButton}></div>
  </div>)
}

function ProfileNav(props) {
  const { user } = props;
  return (<div className={styles.profileNav}>

  </div>)
}

export default function Dashboard(props) {
  const user = JSON.parse(props.currentUser);

  const [showSearch, setShowSearch] = useState(false);

  const navigateToPoint = (id) => {
    console.log(id)
  }

  useEffect(() => {
    //Create the mapbox map
    const map = new mapboxgl.Map({
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
    });

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
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        navigateToPoint(id)
        map.flyTo({
          center: e.features[0].geometry.coordinates,
          zoom: 17.5
        });
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
        mapboxgl: mapboxgl
      });
      geocoder.addTo("#geocoder-container");
    }
    if(document.querySelector(".mapboxgl-ctrl-attrib")){
      document.querySelector(".mapboxgl-ctrl-attrib").remove();
    }
  }, [])

  return (<div>
    <Head>
      <title>Home | YouBarter</title>
      <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
    </Head>
    <div className={styles.homepageCore}>
      <MapCore showSearch={showSearch} setShowSearch={setShowSearch}/>
      <ProfileNav user={user} />
    </div>
  </div>)
}

export async function getServerSideProps({ req, res }) {
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