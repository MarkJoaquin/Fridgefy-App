import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import Layout from "./Layout/Layout.tsx";
import ErrorPage from "./components/ErrorPage";
import Hero from "./components/Hero";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import SingIn from "./components/SingIn/index.tsx";
import SignUp from "./components/Sigup/index.tsx";
import NonSignedInRecipes from "./components/NonSignedInRecipes/index.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/signin",
        element: <SingIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/recipes",
        element: <NonSignedInRecipes />,
      },
      {
        path: "/",
        element: <Hero />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ baseTheme: dark }}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
