import styles from "./NavSideBar.module.css";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUserClock, faCalendar, faHandshake, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function NavSideBar()
{
    return(
        <nav className={`${styles.NavSideBar}`} id="NavSideBar">
            <div>Logo?</div>
            <ul>
                <li><Link to="/"><FontAwesomeIcon icon={faUserClock} className={`${styles.Icon}`}/>{<h2> Attendance</h2>}</Link></li>
                <li><Link to="/"><FontAwesomeIcon icon={faHandshake} className={`${styles.Icon}`}/>{<h2> Events</h2>}</Link></li>
                <li><Link to="/"><FontAwesomeIcon icon={faCalendar} className={`${styles.Icon}`}/>{<h2> My Calendar</h2>}</Link></li>
                <li><Link to="/"><FontAwesomeIcon icon={faArrowRightFromBracket} className={`${styles.Icon}`}/>{<h2> Logout</h2>}</Link></li>
            </ul>
        </nav>
    )
}