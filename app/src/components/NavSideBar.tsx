import {faUser, faUserClock, faCalendar, faHandshake, faArrowRightFromBracket, faChessBoard, faEarthAfrica } from "@fortawesome/free-solid-svg-icons";

import NavSideBarLink from "./NavSideBarLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavSideBar()
{
    const dividerstyle:string = "border-secondary border-solid border-1 my-1";
    return(
        <nav id="NavSideBar" className="group flex flex-col py-1 h-100vh overflow-y-auto overflow-x-hidden w-12 transition-width duration-300 ease-in-out hover:w-50 bg-primary">

            <div className="flex justify-between flex-col h-full">
                <ul>
                    <FontAwesomeIcon icon={faEarthAfrica} className="text-4xl text-accent" />
                    <div className={dividerstyle}></div>
                    <NavSideBarLink link="/" text="Calendar" icon={faCalendar}/>
                    <NavSideBarLink link="/attendance" text="Attendance" icon={faUserClock}/>
                    <NavSideBarLink link="/events" text="Events" icon={faHandshake}/>
                </ul>
                <ul>
                    <div className={dividerstyle}></div>
                    <NavSideBarLink link="/profile" text="Profile" icon={faUser}/>
                    <NavSideBarLink link="/login" text="Exit" icon={faArrowRightFromBracket}/>
                </ul>
            </div>
        </nav>
    )
}