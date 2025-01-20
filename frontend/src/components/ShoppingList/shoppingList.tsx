import ItemsToBuy from "./itemsToBuy";
import MyFridge from "./myFridge";
import RecipesList from "./recipesList";
import "./shoppingList.css";


const ShoppingList = () => {
    return (
        <div className="shopping-list">
            <MyFridge />
            <RecipesList />
            <ItemsToBuy />
        </div>
    );
};

export default ShoppingList; 