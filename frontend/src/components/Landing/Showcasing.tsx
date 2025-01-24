// import styles from './Showcasing.module.css'
import Description from '../Description/Description';
import RecipeList from '../RecipeList/RecipeList';

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

const Showcasing = ({ recipes }: RecipeProps) => {
    if(!recipes.length) return <p> No recipes available </p>

    return (
        <div>
            {/* <h2>Showcase Section</h2> */}
            <Description/>
            <RecipeList recipes = {recipes}/>
        </div>
    )
}

export default Showcasing;