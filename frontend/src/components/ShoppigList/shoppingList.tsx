import ItemsToBuy from "./itemsToBuy";
import MyFridge from "./myFridge";
import RecipesList from "./index";
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
