import {clientAuth} from '../scripts/server/auth.js';

export default function Dashboard(props){
  return (<div>
    Dashboard. {props.loggedIn ? "You are logged in" : "You are not logged in"}
  </div>)
}

export async function getServerSideProps({req, res}) {
  let userData = await clientAuth(req);
  return {
    props: {
      currentUser: JSON.stringify(userData),
      loggedIn: !!userData
    }
  }
}