import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";
import MyFridge from "../components/MyFridge";
import styled from "styled-components";
import { useUser } from "@clerk/clerk-react";


const Main = styled.main`
  display: grid;
  grid-template: "fridge recipes recipes shopping";
  gap: 1rem;
  margin-top: 4rem;
  grid-template-rows: 1fr;
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
