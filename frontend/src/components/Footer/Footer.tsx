import styles from './Footer.module.css'
const Footer = () => {
    return(
        <>
            <div className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.box}>
                        <h4>Why choose Us?</h4>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis delectus quod sequi magni enim pariatur voluptatem, optio culpa. Sed eaque beatae quis tempora, consequatur iste neque culpa nihil fugiat aliquam.</p>
                    </div>
                    <div className={styles.box}>
                        <h4>Useful Links</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Recipes</a></li>
                            <li><a href="#">Sign In</a></li>
                        </ul>
                    </div>
                    {/* <div className={styles.box}>
                        <h4>Contact Us</h4>
                        <div className={styles.formContact}>
                            <form action="">
                                <div className={styles.input}>
                                <input type="email" placeholder='Your Email'/>
                                </div>
                                <div className={styles.actionButton}> <button>Submit</button></div>
                            </form>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className={styles.copyright}>
                    <p>Copyright &copy; 2025. All rights reserved</p>
            </div>
        </>
    )
}

export default Footer;