import { NavLink } from "react-router-dom";
import styled from "styled-components";
import icon from "../../assets/icon.svg";
import { UserButton, useUser } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import SaveUserOnLogin from "../SaveUserOnLogin";

const Nav = styled.nav`
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: mediumseagreen;
  color: #141414;

  padding: 1rem 2rem;

  position: fixed;
  width: -webkit-fill-available;
  top: 0;
  z-index: 10;

`;

const LogoContainer = styled.div`
  padding: 0;

  img {
    width: 30px;
    height: 30px;
    border-radius: 0;
  }

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Ul = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;

  margin: 0;
  padding: 0;

  li {
    margin: 0 10px;
    cursor: pointer;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;

  li {
    color: #ffffff;
  }

  &.active li {
    color: #ffffff;
    font-weight: bold;
  }
`;

const Navbar = () => {
  const user = useUser();
  // console.log(user);

  return (
    <Nav>
      <Ul>
        <LogoContainer>
          <img src={icon} alt="icon" />
        </LogoContainer>
      </Ul>
      <Ul>
        {user.isSignedIn ? (
          <StyledNavLink to="/shopping-list">
            <SaveUserOnLogin />
            <li>Shopping List</li>
          </StyledNavLink>
        ) : (
          <StyledNavLink to="/">
            <li>Home</li>
          </StyledNavLink>
        )}
        <StyledNavLink to="/recipes">
          <li>Recipes</li>
        </StyledNavLink>
        {user.isSignedIn ? (
          <UserButton appearance={{ baseTheme: dark }} />
        ) : (
          <StyledNavLink to="/signin">
            <li>Sing In</li>
          </StyledNavLink>
        )}
      </Ul>
    </Nav>
  );
};

export default Navbar;
