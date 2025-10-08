import styles from './Navbar.module.css';
import avatar from "../assets/avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faInbox } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <div className={styles.nav}>
        <div className={styles.leftContainer}>
            
        </div>
        <div className={styles.rightContainer}>
            {/* Inbox */}
            <div className={styles.smallButton}>
                <FontAwesomeIcon icon={faInbox} />
                <div className={styles.notificationCount}>4</div>
            </div>
            {/* User data*/}
            <div className={styles.userContainer}>
                <span className={styles.name}>John Doe</span>
                <span className={styles.role}>Employee</span>
            </div>
            <img src={avatar} alt="" width={40} height={40} />
        </div>


    </div>
  )
}

export default Navbar