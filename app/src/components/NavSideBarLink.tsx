import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
//bfdcff
const buttonStyle:string = "no-underline flex text-center justify-between mb-0.5 min-w-min hover:bg-secondary hover:mix-w-full my-1";

const NavSideBarLink = ({link, text, icon}: {link: string, text: string, icon: IconProp}) => {
    return(
        <Link to={link} className={buttonStyle}>
            <FontAwesomeIcon icon={icon} className="text-3xl px-1 text-accent"/>
            <h2 className="hidden group-hover:inline pr-3"> {text}</h2>
        </Link>
    )
}
export default NavSideBarLink;