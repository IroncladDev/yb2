/* eslint-disable @next/next/no-img-element */
import styles from '../styles/components/profilenav.module.scss';
import Link from 'next/link';
import * as Icon from 'react-feather';
export default function ProfileNav(props) {
  const { user, page } = props;
  return (<div className={styles.profileNav}>
    <Link href="/home/profile" passHref>
      <a>
        <div className={styles.navItem + " " + styles.navItemImage + " " + (page === "profile" ? styles.active : "")}>
          <img src={props.user.image} alt="Your Profile image"/>
        </div>
      </a>
    </Link>
    <Link href="/home" passHref>
      <a>
        <div className={styles.navItem + " " + (page === "home" ? styles.active : "")}>
          <Icon.MapPin />
        </div>
      </a>
    </Link>
    <Link href="/home/create" passHref>
      <a>
        <div className={styles.navItem + " " + (page === "create" ? styles.active : "")}>
          <Icon.Plus />
        </div>
      </a>
    </Link>
    <Link href="/home/settings" passHref>
      <a>
        <div className={styles.navItem + " " + (page === "settings" ? styles.active : "")}>
          <Icon.Settings strokeWidth={0.5}/>
        </div>
      </a>
    </Link>
    <Link href="/api/get/logout" passHref>
      <a>
        <div className={styles.navItem}>
          <Icon.LogOut strokeWidth={0.5}/>
        </div>
      </a>
    </Link>
  </div>)
}