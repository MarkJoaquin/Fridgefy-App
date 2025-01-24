import React from 'react';
import { useUser } from "@clerk/clerk-react";

interface Recipe {
    ingredients: string[];
}

const MyFridge = () => {
    const { user } = useUser();
    const [items, setItems] = React.useState<string[]>([]);
    const [availableIngredients, setAvailableIngredients] = React.useState<string[]>([]);
    const [selectedIngredient, setSelectedIngredient] = React.useState('');
    const [error, setError] = React.useState('');

    const fetchData = async () => {
        try {
            const [ingredientsRes, fridgeRes] = await Promise.all([
                fetch('https://dummyjson.com/recipes?limit=0'),
                user && fetch(`http://localhost:3000/myFridge/get?userEmail=${user.primaryEmailAddress?.emailAddress}`)
            ]);

            const ingredientsData = await ingredientsRes.json();
            const allIngredients = new Set<string>();
            ingredientsData.recipes.forEach((recipe: Recipe) => {
                recipe.ingredients.forEach(ingredient => allIngredients.add(ingredient));
            });
            setAvailableIngredients(Array.from(allIngredients).sort());

            if (fridgeRes) {
                const fridgeData = await fridgeRes.json();
                if (Array.isArray(fridgeData)) {
                    setItems(fridgeData.map(item => item.ingredient));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch data');
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [user]);

    const handleFridgeOperation = async (operation: 'add' | 'remove', ingredient?: string) => {
        if (!user) {
            setError('Please sign in first');
            return;
        }

        const ingredientToUse = operation === 'add' ? selectedIngredient : ingredient;

        if (!ingredientToUse) {
            setError('Please select an ingredient');
            return;
        }

        if (operation === 'add' && items.includes(ingredientToUse)) {
            setError('This ingredient is already in your fridge');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/myFridge/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.primaryEmailAddress?.emailAddress,
                    ingredient: selectedIngredient
                })
            });

            if (!response.ok) {
                throw new Error('Operation failed');
            }

            setItems([...items, selectedIngredient]);
            setSelectedIngredient('');
            setError('');
        } catch (error: any) {
            setError(error.message || 'Failed to add ingredient');
            console.error('Error:', error);
        }
    };

    const handleRemoveItem = async (ingredientToRemove: string) => {
        if (!user) {
            setError('Please sign in to remove ingredients');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/myFridge/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: user.primaryEmailAddress?.emailAddress,
                    ingredient: ingredientToRemove
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove ingredient');
            }

            setItems(items.filter(item => item !== ingredientToRemove));
            setError('');
        } catch (error: any) {
            setError(error.message || 'Failed to remove ingredient');
            console.error('Error:', error);
        }
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
                <button onClick={() => handleFridgeOperation('add')}>Add</button>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="list-container">
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item}
                            <button onClick={() => handleRemoveItem(item)}>❌</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyFridge; 