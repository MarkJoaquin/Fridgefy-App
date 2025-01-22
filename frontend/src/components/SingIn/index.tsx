import { SignIn } from "@clerk/clerk-react";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SingIn = () => {
  return (
    <Div>
      <SignIn
        signUpUrl="/signup"
        forceRedirectUrl={"/recipes"}
        afterSignOutUrl={"/hero"}
      />
    </Div>
  );
};

export default SingIn;
