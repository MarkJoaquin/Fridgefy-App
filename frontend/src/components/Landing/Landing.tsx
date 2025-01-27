import { NavLink } from "react-router-dom";
import styles from "./Landing.module.css";
import styled from "styled-components";

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 2rem;
  font-weight: bold;

  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
  }

    &:hover {
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
    }
  }
`;

const StyledNavLinkBtn = styled(NavLink)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #4ade80;
  border-radius: 2rem;
  color: black;
  font-weight: bold;

  &:hover {
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
  }

    &:hover {
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
    }
  }
`;

const Landing = () => {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.wrapperContainer}>
        <div className={styles.container}>
          <p>This is Fridgefy</p>
          <h1>
            The #1 Sous-chef in your <span>Kitchen</span>
          </h1>
          <h2>
            Fridgefy is a web-based application that allows you to manage your
            food inventory, create shopping lists, and share recipes with
            friends and family.
          </h2>
          <div className={styles.actionButtons}>
            <StyledNavLinkBtn to="/signup" className={styles.darkButton}>
              Register Now
            </StyledNavLinkBtn>
            <StyledNavLink to="/signin" className={styles.lightButton}>
              Sing In here
            </StyledNavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
