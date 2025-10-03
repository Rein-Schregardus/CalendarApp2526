import styles from "./NavSideBar.module.css";
import Button from "./Button";

export default function NavSideBar()
{
    return(
        <div className={`${styles.NavSideBar}`}>
            <Button children={<p>toggle</p>}></Button>
        </div>
    )
}