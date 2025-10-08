import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule'
import MiniCalendar from '../components/MiniCalendar'

import styles from './HomePage.module.css';


const Home = () => <div className={styles.container}>
    <div className={styles.navContainer}>
    <h1>Calendar App</h1>
    </div>
    <div className={styles.mainContainer}>
        <Navbar />
        <div className={styles.content}>
            <div className={styles.left}>
                <div className={styles.scheduleContainer}>
                    <Schedule />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.miniCalendarContainer}>
                    <MiniCalendar />
                </div>
            </div>
        </div>
    </div>
</div>;

export default Home;