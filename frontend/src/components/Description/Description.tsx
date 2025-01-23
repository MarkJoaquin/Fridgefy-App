import styles from './Description.module.css'
const Description = () => {
    return(
        <>
            <section className={styles.description}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <p>Best in food</p>
                        <h3 className={styles.sectionTitle}>Choose healthy, choose <span>Easy</span></h3>
                    </div>
                    <div className={styles.content}>
                        <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor rem saepe cum quam consectetur ipsa magni eum. Voluptates dignissimos dicta dolorum quos provident ad beatae voluptas ullam perferendis, molestiae aut? 
                        </p>
                        
                        {/* <br/> */}

                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, repellendus! Maiores ducimus rem unde illum, sed, consequuntur ipsam natus quasi, in blanditiis soluta tempore ullam nemo quos. Minima, beatae saepe! Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat eum excepturi amet facilis eligendi eveniet facere! Eaque praesentium, iste commodi exercitationem nostrum fuga molestiae tempore impedit natus, eum aut aliquam!</p>
                    </div>
                </div>
                <div className={styles.image}>
                    <div className={styles.imageContainer}>
                        {/* <img src="../../assets/showcase_description.jpg" alt="" /> */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Description;