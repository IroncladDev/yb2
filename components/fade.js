import styles from '../styles/components/fade.module.scss'
import { useState, useEffect, useRef } from 'react'
export default function Fade(props) {
  const [visible, setVis] = useState(false);
  const self = useRef(null);
  const listenToScroll = (e) => {
    try {
      if (window.pageYOffset + (window.innerHeight - 70) >= (self.current.getBoundingClientRect().top)) {
        setVis(true)
      } else {
        setVis(false)
      }
    }catch(e){
      setVis(false);
    }
  }
  useEffect(() => {
    listenToScroll();
    window.addEventListener("scroll", listenToScroll);
  }, [])

  return (
    <div ref={self} className={(props.classes ? props.classes + " " : "") + (visible ? styles.visible : styles.transparent)}>
      {props.children}
    </div>
  );

}