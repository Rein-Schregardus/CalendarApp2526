import styles from './MiniCalendar.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const dummyDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4]

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const MiniCalendar = () => {
  return (
    <div className={styles.card}>
        <div className={styles.header}>
            <div className={styles.smallButton}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <span className={styles.lightText}>October 2025</span>
                  <div className={styles.smallButton}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
        </div>

        

        <div className={styles.content}>

            <div className={styles.weekdays}>
                {weekdays.map((d) => (
                    <span key={d} className={styles.weekday}>
                      {d}
                    </span>
                ))}
            </div>

            {/* Calendar grid */}
            <div className={styles.grid}>
                {dummyDays.map((day, i) => (
                  <div key={i}  className={`${styles.day} ${day == 12 ? styles.selected : ""}`}>
                    {day}
                  </div>
                ))}
            </div>

        </div>
    </div>
  )
}

export default MiniCalendar