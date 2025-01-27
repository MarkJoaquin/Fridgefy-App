import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import MyFridge from "../components/MyFridge";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";

const Main = styled.main`
  display: grid;
  grid-template: "fridge recipes recipes shopping";
  gap: 1rem;
  margin-top: 5rem;
  margin-bottom: 5rem;


  @media (max-width: 768px) {
    grid-template:
      "fridge"
      "recipes"
      "shopping";
  }

  @media only screen and (min-width: 819px) and (max-width: 1181px) {
    grid-template:
      "fridge recipes"
      "shopping recipes";
  }
`;

const Layout = () => {
  const { user } = useUser();
  return (
    <>
      <Navbar />
      {user ? (
        <Main>
          <MyFridge />
          <Outlet />
        </Main>
      ) : (
        <div>
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Layout;
