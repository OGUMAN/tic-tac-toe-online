import styles from './Menu.module.scss';
import { Link } from "react-router-dom";

const Menu = () => {
    return(
        <div className="show">
            <div className={styles.menu}>
                <div className={styles.btns}>
                    <Link to='solo'>
                        <div className={styles.btn}>
                            <div className={styles.btn__text}>
                                <span>🤖</span>Single player game
                            </div>
                        </div>
                    </Link>
                    <Link to='multiplayer'>
                        <div className={styles.btn}>
                            <div className={styles.btn__text}>
                                <span>🤝</span> Multiplayer
                            </div>
                        </div>
                    </Link>
                    <Link to='settings'>
                        <div className={styles.btn}>
                            <div className={styles.btn__text}>
                                <span>⚙️</span> Settings
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Menu;