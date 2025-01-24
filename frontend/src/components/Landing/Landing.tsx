import styles from "./Landing.module.css"

const Landing = () => {
    return (
        <div className={styles.landingContainer}>
            <div className={styles.wrapperContainer}>
                <div className={styles.container}>
                    <p>This is Fridgefy</p>
                    <h1>The #1 Sous-chef in your <span>Kitchen</span></h1>
                    <h2>Fridgefy is a web-based application that allows you to manage your food inventory, create shopping lists, and share recipes with friends and family.</h2>
                    <div className={styles.actionButtons}>
                        <button id="register" className={styles.darkButton}>Register Now</button>
                        <button id="login" className={styles.lightButton}>Login here</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing;