import React from 'react';
import "./shoppingList.css";

interface Recipe {
    ingredients: string[];
}

const MyFridge = () => {
    const [items, setItems] = React.useState<string[]>(() => {
        const savedItems = localStorage.getItem('fridgeItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [availableIngredients, setAvailableIngredients] = React.useState<string[]>([]);
    const [selectedIngredient, setSelectedIngredient] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        localStorage.setItem('fridgeItems', JSON.stringify(items));
    }, [items]);

    React.useEffect(() => {
        fetch('https://dummyjson.com/recipes?limit=0')
            .then(res => res.json())
            .then(data => {
                const allIngredients = new Set<string>();
                data.recipes.forEach((recipe: Recipe) => {
                    recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient));
                });
                setAvailableIngredients(Array.from(allIngredients).sort());
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    }, []);

    const handleAddItem = () => {
        if (selectedIngredient === '') {
            return;
        }
        
        if (availableIngredients.includes(selectedIngredient)) {
            setItems([...items, selectedIngredient]);
            setSelectedIngredient('');
            setError('');
        } else {
            setError('Please select a valid ingredient from the list');
        }
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div>
            <h1>My Fridge</h1>
            <div className="input-container">
                <input
                    list="ingredients"
                    value={selectedIngredient}
                    onChange={(e) => {
                        setSelectedIngredient(e.target.value);
                        setError('');
                    }}
                    placeholder="Search fridge"
                />
                <datalist id="ingredients">
                    {availableIngredients.map((ingredient, index) => (
                        <option key={index} value={ingredient} />
                    ))}
                </datalist>
                <button onClick={handleAddItem}>Add</button>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="list-container">
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item}
                            <button onClick={() => handleRemoveItem(index)}>❌</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyFridge; 