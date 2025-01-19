import { SignUp } from "@clerk/clerk-react";
const Login = () => {
    return (
        <div>
            <SignUp signInUrl="/signin" />
        </div>
    );
};

export default Login;