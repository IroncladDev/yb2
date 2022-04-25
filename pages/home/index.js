/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import styles from '../../styles/pages/home.module.scss';
import ui from '../../styles/ui.module.scss';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { clientAuth } from '../../scripts/server/auth.js';
import { Service } from '../../scripts/server/mongo.js';
import { useState, useEffect, useRef } from 'react';
import * as Icon from 'react-feather';
import ProfileNav from '../../components/profilenav.js';
import { mapboxToken, keywords, hcSitekey } from '../../public/vars.js';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import Swal from '../../scripts/client/modal';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        </select>
      </CollapseGroup>
    </div>

  </div>)
}

function SrvBox(props) {
  const [mdtext, setMdText] = useState("")
  useEffect(() => {
    function extractContent(s) {
      var span = document.createElement('span');
      span.innerHTML = s;
      return span.textContent || span.innerText;
    };
    setMdText(extractContent(DOMPurify.sanitize(marked(props.description))))
  }, [props.description])
  return (<div className={styles.srvBox + " " + ui.box8} onClick={props.onClick}>
    <div className={styles.srvHead}>
      <img src="/images/user.png" alt="User Profile Image" />
      <div className={styles.srvBoxInfo}>
        <h4>{props.title}</h4>
        <span>@{props.author}</span>
      </div>
    </div>
    <p className={styles.srvBodyDesc}>{mdtext}</p>
  </div>);
}

function MapCore(props) {
  const currentUser = props.currentUser;
  const [data, setData] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const alertUserProfile = async (username) => {
    const user = await fetch("/api/get/user?username=" + username).then(r => r.json());
    Swal.fire({
      html: `<div class="${styles.profilePopupFlex}">
        <img src="${user.image}" alt="User Profile Image" class="${styles.profileImagePopup}"/>
        <div>
          <h4>${user.displayName}</h4>
          <span>@${user.username}</span>
          <p>${user.bio}</p>
        </div>
      </div>`
    })
  }

  const deleteListing = async (id) => {
    const randStr = Math.random().toString(36).slice(2)
    const { value } = await Swal.fire({
      title: "Delete Listing?",
      html: "Are you sure you would like to delete this listing?  This action cannot be reversed.  If so, please type <strong>" + randStr.toLowerCase() + "</strong> to confirm.",
      input: "text",
      inputPlaceholder: "Confirm Deletion",
      showCancelButton: true,
    })
    if (value && value.toLowerCase() === randStr.toLowerCase()) {
      let data = await fetch("/api/post/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          id
        })
      }).then(r => r.json());
      if (data.success) {
        props.setViewItem(false);
        props.updateData();
      } else {
        Swal.fire({
          title: "Failed",
          message: data.message || "We encountered an internal error, it seems.  Please try again or contact support if the problem persists."
        })
      }
    }
  }

  const warnUser = async (user) => {
    const { value } = await Swal.fire({
      title: "Warn User",
      html: "Please enter a reason for warning this user",
      input: "text",
      inputPlaceholder: "Reason for Warning",
      showCancelButton: true,
    })
    if (value) {
      let data = await fetch("/api/post/warn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user, reason: value
        })
      }).then(r => r.json());
      if (data.success) {
        Swal.fire({
          title: "Warning sent",
          text: "We've sent that user an email with the reason for the warning",
        })
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "We encountered an internal error, it seems.  Please try again or contact support if the problem persists."
        })
      }
    }
  }

  const banUser = async (user) => {
    const { value } = await Swal.fire({
      title: "Ban User",
      html: "Warning!  This user will never be able to access the site again from that device!!  Are you sure you would like to ban them?  If so, please enter a reason.",
      input: "text",
      inputPlaceholder: "Reason for Ban",
      showCancelButton: true,
    })
    if (value) {
      let data = await fetch("/api/post/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          user, reason: value
        })
      }).then(r => r.json());
      if (data.success) {
        Swal.fire({
          title: "Banned",
          text: "That user has been removed from the site.",
        })
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "We encountered an internal error, it seems.  Please try again or contact support if the problem persists."
        })
      }
    }
  }

  useEffect(() => {
    if (props.viewItem) {
      (async () => {
        if (props.viewItem) {
          const id = props.viewItem;
          const srv = await fetch("/api/get/srv?_id=" + id).then(r => r.json());
          const srvLoc = await fetch("/api/get/srvfind?location=" + srv.location).then(r => r.json());
          setData({
            srv, srvLoc
          })
        }
      })();
      setHasFetchedData(true);
    } else {
      setData({})
      setHasFetchedData(false)
    }
  }, [props.viewItem])


  return (<div className={styles.mapCore}>
    <div id="mapid" className={styles.mapboxGl}></div>
    <div className={styles.viewPopup + " " + (props.viewItem ? styles.showViewItem : styles.hideViewItem)}>
      <div className={styles.popupCoreBody}>
        {(props.viewItem && (data.hasOwnProperty("srv")) && hasFetchedData) && <div>
          <div className={styles.viewPopupHeader}>
            <div className={styles.userImageWrapper}>
              <img src={data.srv.author.image} alt={data.srv.author.username + "'s profile image"} className={styles.userImage} />
            </div>
            <div className={styles.userNames}>
              <div className={styles.userNick}>{data.srv.author.displayName}</div>
              <div className={styles.userUsername}>{data.srv.author.bio || data.srv.author.displayName + " has no bio"}</div>
            </div>
            <div className={styles.flexGrowHeader}></div>
            <div className={styles.buttonContainer}>
              <button className={styles.closeBtn} onClick={() => props.setViewItem(false)}>{"✕"}</button>
            </div>
          </div>
          <div className={styles.popupSrvBody}>
            <h1>{data.srv.title}</h1>
            <div className={styles.stats}>
              <span className={styles.srvType}><Icon.Tag />{" "}{data.srv.typeBool ? "Services" : "Goods"}</span>{" • "}
              <span className={styles.srvTags}>{data.srv.tags.map(x => <span key={x} className={styles.srvTag}>{"#"}{x}</span>)}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(data.srv.description)) }} className={styles.descriptionContent}></div>
            {((currentUser.username === data.srv.author.username) || currentUser.admin) && <button className={ui.buttonDanger} onClick={() => deleteListing(data.srv._id)}>Delete</button>}
            {currentUser.admin && <button className={ui.buttonDanger} onClick={() => warnUser(data.srv.author.username)}>Warn</button>}
            {(currentUser.admin) && <button className={ui.buttonDanger} onClick={() => banUser(data.srv.author.username)}>Ban User</button>}
            {currentUser.username !== data.srv.author.username && <button className={ui.buttonCancel} onClick={() => props.report(data.srv._id)}>Report</button>}
            {currentUser.username !== data.srv.author.username && <button className={ui.buttonAction} onClick={() => props.offer(data.srv._id)}>Make an Offer</button>}
          </div>

          {data.srvLoc.length > 1 && <div className={styles.otherLocBody}>
            <h3>More in this location</h3>
            <div className={styles.srvBoxList}>
              {data.srvLoc.filter(x => x._id !== data.srv._id).map(s => <SrvBox description={s.description} key={s._id} title={s.title} author={s.author.username} onClick={() => props.setViewItem(s._id)} />)}
            </div>

          </div>}
        </div>}
      </div>
    </div>
  </div>)
}

export default function Dashboard(props) {
  const user = JSON.parse(props.currentUser);

  const [showSearch, setShowSearch] = useState(!(!!props.viewingItem));
  const [viewItem, setViewItem] = useState(props.viewingItem || false);
  const [results, setResults] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchString, setSearchString] = useState([]);
  const _map = useRef(null);

  const navigateToPoint = (id) => {
    setShowSearch(false);
    setViewItem(id)
  }

  const runSearch = async (search) => {
    setSearchString(search);
    let stringifySearch = [];
    for (let i in search) {
      stringifySearch.push(`${i}=${search[i]}`)
    }
    let data = await fetch(`/api/get/feed?${stringifySearch.join`&`}`).then(r => r.json());
    setResults(data);
  }

  const updateData = async () => {
    runSearch(setSearchString)
  }

  const offer = async (id) => {
    const { value: offerText } = await Swal.fire({
      title: "Make an Offer",
      input: 'textarea',
      inputPlaceholder: "...",
      validationMessage: "Minimum length is 32 characters",
      html: `Enter any information you'd like to share, such as what you'd like to barter, what time would be suitable for you, etc.  <strong>If the creator of this listing wants to barter with you, this conversation will continue via email.</strong>`,
      showCancelButton: true
    })
    if (offerText) {
      let data = await fetch("/api/post/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          value: offerText, id
        })
      }).then(r => r.json());
      if (data.success) {
        Swal.fire({
          title: "Sent!",
          text: "We sent an email to the creator of this listing.  If they accept your offer, you'll be notified via email.  Keep an eye out for an email from " + data.email + "!",
        })
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "Something went wrong, looks like an internal error on our side.  Please try again later or contact us."
        })
      }
    }
  }

  const report = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Please provide a reason",
      text: "Please tell us why this should be taken down/removed.",
      input: "text",
      showCancelButton: true
    })
    if (reason) {
      const data = await fetch("/api/post/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          id, reason
        }),
      }).then(r => r.json());
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Your report has been sent.  We'll take care of it as soon as possible."
        })
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "An internal error occured on our side.  Please try again or email contact@youbarter.us to report this."
        })
      }
    }
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
    if (document.querySelector(".mapboxgl-ctrl-group")) {
      console.log("removed")
      document.querySelector(".mapboxgl-ctrl-group").remove();
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
      <MapCore viewItem={viewItem} setViewItem={setViewItem} currentUser={user} offer={offer} report={report} updateData={updateData} />
      <ProfileNav user={user} page={"home"} />
    </div>
    <SearchEngine showSearch={showSearch} keywords={props.keywords} runSearch={runSearch} />
    <div className={styles.showSearchButton + " " + (showSearch ? styles.showSearch : styles.hideSearch)} onClick={() => { setShowSearch(!showSearch); if (!showSearch) setViewItem(false) }}>
      <Icon.ChevronRight />
    </div>
  </div>)
}

export async function getServerSideProps({ req, query }) {
  let userData = await clientAuth(req);
  let serviceExists = !!(await Service.findOne({ _id: query.srv }));
  if (userData) {
    return {
      props: {
        currentUser: JSON.stringify(userData),
        keywords,
        viewingItem: serviceExists ? query.srv : false,
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