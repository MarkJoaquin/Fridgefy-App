import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import MyFridge from "../components/MyFridge";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

  return (
    <>
      <Navbar />
      {user && location.pathname === "/" ? (
        <Main style={{ display: "flex", flexDirection: "column", marginTop: "0" }}>
          <Outlet />
        </Main>
      ) : user && location.pathname !== "/" ? (
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
