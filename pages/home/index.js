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
import { mapboxToken, keywords } from '../../public/vars.js';

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = mapboxToken;

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
  const [showRes, setRes] = useState(false);
  const [numResults, setResults] = useState(500);

  useEffect(() => {
    if (filter)
      props.runSearch(filter);
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
            setFilter({
              ...filter,
              search: e.target.innerText
            });
            setRes(false);
          }} dangerouslySetInnerHTML={{ __html: keyword.replace(search, `<strong>${search}</strong>`) }}></div>)}
          <div className={styles.searchResult} onClick={() => {
            setSearch(search);
            setFilter({
              ...filter,
              search: search
            });
            setRes(false)
          }}>filter with {search}...</div>
        </div>}
      </CollapseGroup>
      <CollapseGroup title="Filter">
        <CheckboxGroup fields={['goods', 'services']} updateFields={(f) => {
          setFilter({
            ...filter,
            gs: f.goods && f.services ? "" : (f.goods ? "goods" : (f.services ? "services" : ""))
          });
        }} />
      </CollapseGroup>
      <CollapseGroup title="Result Limit">
        <div className={ui.formLabel}>No. of results on the map</div>
        <input className={ui.input} type="number" value={numResults} min={1} onChange={e => {
          setResults(e.target.value)
          setFilter({
            ...filter,
            results: e.target.value
          })
        }} style={{ width: '100%' }} />
      </CollapseGroup>
      <CollapseGroup title="Sort By">
        <select className={ui.buttonAction} style={{ width: '100%' }} onChange={e => {
          setFilter({
            ...filter,
            sort: e.target.value
          })
        }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="rating">Rating</option>
        </select>
      </CollapseGroup>
    </div>

  </div>)
}

function MapCore(props) {
  useEffect(() => {
    if(props.viewItem){
      const id = props.viewItem;
    }
  }, [props.viewItem])
  return (<div className={styles.mapCore}>
    <div id="mapid" className={styles.mapboxGl}></div>
    <div className={styles.viewPopup + " " + (props.viewItem ? styles.showViewItem : styles.hideViewItem)}>

    </div>
  </div>)
}



export default function Dashboard(props) {
  const user = JSON.parse(props.currentUser);

  const [showSearch, setShowSearch] = useState(true);
  const [viewItem, setViewItem] = useState(false);
  const [results, setResults] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false);
  const _map = useRef(null);

  const navigateToPoint = (id) => {
    setShowSearch(false);
    setViewItem(id)
  }

  const runSearch = async (search) => {
    let stringifySearch = [];
    for (let i in search) {
      stringifySearch.push(`${i}=${search[i]}`)
    }
    let data = await fetch(`/api/get/feed?${stringifySearch.join`&`}`).then(r => r.json());
    setResults(data);
  }

  //Create the mapbox map
  useEffect(() => {
    fetch(`/api/get/feed`).then(r => r.json()).then(setResults)
    if (_map.current) return;
    _map.current = (new mapboxgl.Map({
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

    const map = _map.current;

    // Load the marker icon
    map.loadImage('/icons/marker.png', (error, image) => {
      if (error) throw error;
      map.addImage('marker', image);
    });

    map.on("load", () => {
      setMapLoaded(true)
      map.addSource('data', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });
      map.addLayer({
        'id': 'data-circles',
        'type': 'circle',
        'source': 'data',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#5E8B7E',
          'circle-radius': 15,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#477568'
        },
      });
      map.addLayer({
        'id': 'data-contents',
        'type': 'symbol',
        'source': 'data',

        filter: ['has', 'point_count'],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 14,
        },
        paint: {
          "text-color": "white",
        },
      });
      map.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'data',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-allow-overlap': true,
          'icon-image': 'marker',
        }
      });
      map.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        let id = e.features[0].properties.id;
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        map.flyTo({
          center: coordinates,
        })
        navigateToPoint(id)
      })
      map.on('click', 'data-circles', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['data-circles']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('data').getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });
      map.on('mouseenter', 'data-circles', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'data-circles', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'unclustered-point', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'unclustered-point', () => {
        map.getCanvas().style.cursor = '';
      });
    })

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
    const map = _map.current;
    /* [
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
            }
          ] */
    if (mapLoaded) {
      let geojson = {
        'type': 'FeatureCollection',
        'features': results.map(r => ({
          'type': 'Feature',
          'properties': {
            'id': r._id,
          },
          'geometry': {
            'type': 'Point',
            'coordinates': r.location.split`,`.map(Number)
          }
        }))
      };
      map.getSource('data').setData(geojson);
    }
  }, [results, mapLoaded])

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
    <SearchEngine showSearch={showSearch} keywords={props.keywords} runSearch={runSearch} />
    <div className={styles.showSearchButton + " " + (showSearch ? styles.showSearch : styles.hideSearch)} onClick={() => {setShowSearch(!showSearch);if(!showSearch)setViewItem(false)}}>
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