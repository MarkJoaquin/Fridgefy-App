import React from 'react';

interface Recipe {
    ingredients: string[];
}

const MyFridge = () => {
    const [items, setItems] = React.useState<string[]>([]);
    const [availableIngredients, setAvailableIngredients] = React.useState<string[]>([]);
    const [selectedIngredient, setSelectedIngredient] = React.useState('');
    const [error, setError] = React.useState('');

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
        
    };

    const handleRemoveItem = () => {
        
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
                            <button onClick={() => handleRemoveItem()}>❌</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyFridge; 