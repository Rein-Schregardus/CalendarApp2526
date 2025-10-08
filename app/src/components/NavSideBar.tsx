import styles from "./NavSideBar.module.css";
// import Button from "./Button";
import { Link } from "react-router-dom";
import { useState } from "react";


export default function NavSideBar()
{
    // const [Open, SetOpen] = useState(true);
    return(

        <nav className={`${styles.NavSideBar}`} id="NavSideBar">
            <div>Logo?</div>
            {/* <button className="ButtonSideBar" children={<i className='bxr  bx-menu-wider'  ></i>} onClick={() => {SetOpen(!Open)}}></button> */}
            <ul>
                <li><Link to="/"><i className='bxr  bx-key'></i>{<h2> Login</h2>}</Link></li>
                <li><Link to="/"><i className='bxr  bx-calendar-alt'  ></i>{<h2> Calendar</h2>}</Link></li>
            </ul>
        </nav>
    )
}