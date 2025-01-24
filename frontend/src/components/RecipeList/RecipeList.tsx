import styles from './RecipeList.module.css'
import RecipeCard from './RecipeCard'

type Recipe = {
    id: number,
    image: string,
    name: string,
    prepTimeMinutes: number,
    rating:number,
}

interface RecipeProps {
    recipes: Recipe[]
}

const RecipeList = ({ recipes }: RecipeProps) => {


    return(
        <div className = {styles.recipeSection}>
            <div className={styles.wrapper}>
                <h2>Our Recipes</h2>
                <ul className={styles.recipesContainer}>
                    {recipes.map((recipe:Recipe)=>(
                        <RecipeCard key={recipe.id} recipe = {recipe}/>
                    ))}
                </ul>
                <div className={styles.actionButtons}>
                    <button className={styles.moreButton}>More recipes</button>
                </div>
            </div>
        </div>
    )
}

export default RecipeList;