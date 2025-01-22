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
import RecipeList from "./components/Recipes/index.tsx";

import { Provider } from "react-redux";
import store from "./app/store";
import ShoppingList from "./components/ShoppigList/shoppingList";

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
        element: <RecipeList />,
      },
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingList />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ baseTheme: dark }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
