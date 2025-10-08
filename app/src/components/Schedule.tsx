import styles from './Schedule.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Schedule = () => {
  return (
    <div className={styles.card}>
        <div className={styles.header}>
            <div className={styles.headerLeft}>

              <button className={styles.button}>
                  <span>Today</span>
              </button>

              <div className={styles.arrowContainer}>
                  <div className={styles.smallButton}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div className={styles.smallButton}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
              </div>

              <h2>October 2025</h2>

            </div>
            <button className={styles.button}>
                <span>Week</span>
                <FontAwesomeIcon icon={faCaretDown} />
            </button>
        </div>

        <hr />

        <div className={styles.content}>
            Schedule content
        </div>
    </div>
  )
}

export default Schedule