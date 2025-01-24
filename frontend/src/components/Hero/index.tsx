
// import Navbar from "../NavBar";
import Landing from "../Landing/Landing";
import Showcasing from "../Landing/Showcasing";
import Footer from "../Footer/Footer";

// import styles from './Hero.module.css'
import { useEffect, useState } from "react";


const randomArray = <T,>(array:T[]):T[] => {
    for (let i = array.length -1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]] = [array[j],array[i]]
    }

    return array;
}

const fetchRecipes = async (setData:any) => {
    try{
        const response = await fetch ('https://dummyjson.com/recipes')

        if(!response.ok){
            throw new Error ('Failed to fetch recipes')
        }

        const data = await response.json()
        const renderRecipes = randomArray(data.recipes)
        const recipesData = renderRecipes.slice(0,3)
        setData(recipesData)
        console.log('RECIPES: ', recipesData )
    } catch (error) {
        console.error('Error fetching recipes: ', error)
    }
}



function Hero () {
    const [data, setData] = useState([])

    useEffect(() => {
        fetchRecipes(setData)
    },[])

    return (
        <>
            <Landing/>
            <Showcasing recipes = {data}/>
            <Footer/>
        </>
    )
}

export default Hero;