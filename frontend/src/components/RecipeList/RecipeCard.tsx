import styles from './RecipeCard.module.css'

type Recipe = {
    id: number,
    image: string,
    name: string,
    prepTimeMinutes: number,
    rating:number,
}

interface RecipeProps {
    recipe: Recipe
}

const RecipeCard = ({ recipe }: RecipeProps) => {
    const {id, image, name, prepTimeMinutes, rating} = recipe;
    return(
        <>
            <li className={styles.recipeCard} key = {id}>
                <div className={styles.container}>
                    <img src={image} alt={name} />
                    <div className={styles.recipeInfo}>
                        <p className={styles.cardTitle}>{name}</p>
                        <div className={styles.features}>
                            <p><span>Rating:</span> {rating}/5</p>
                            <p><span>Prep Time:</span> {prepTimeMinutes} min</p>
                        </div>
                    </div>
                </div>
            </li>
        </>
    )
}

export default RecipeCard;