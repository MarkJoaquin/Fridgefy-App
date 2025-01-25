import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { AppDispatch } from "../../app/store";
import { useUser } from "@clerk/clerk-react";
import {
  getShoppingList,
  deleteShoppingItem,
  selectShoppingList,
} from "../../features/shoppingItems/shoppingSlice";
import styled from "styled-components";

const ItemsToBuy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { items, loading, error } = useSelector(selectShoppingList);

  useEffect(() => {
    if (userEmail) {
      dispatch(getShoppingList(userEmail));
    }
  }, [dispatch, userEmail]);

  const handleDeleteItem = async (ingredient: string) => {
    if (!userEmail) return;

    try {
      await dispatch(deleteShoppingItem({ userEmail, ingredient })).unwrap();
      toast.success("Item removed from shopping list");
      dispatch(getShoppingList(userEmail));
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <Container>
      <h2>Items to Buy</h2>
      <Toaster />
      {items.length > 0 ? (
        <ItemList>
          {items.map((item: { ingredient: string }) => (
            <Item className="list-item" key={item.ingredient}>
              <ItemText>{item.ingredient}</ItemText>
              <DeleteButton
                className="delete-button"
                onClick={() => handleDeleteItem(item.ingredient)}
              >
                Delete
              </DeleteButton>
            </Item>
          ))}
        </ItemList>
      ) : (
        <p>No items in your shopping list.</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  display: grid;
  grid-area: shopping;
  margin-top: 1rem;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemText = styled.span`
  font-size: 1rem;
  color: #333;
`;

const DeleteButton = styled.button`
  background-color: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: #c62828;
  }
`;

export default ItemsToBuy;
