import { SignUp } from "@clerk/clerk-react";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Login = () => {
  return (
    <Div>
      <SignUp
        signInUrl="/signin"
        forceRedirectUrl={"/recipes"}
        afterSignOutUrl={"/hero"}
      />
    </Div>
  );
};

export default Login;
