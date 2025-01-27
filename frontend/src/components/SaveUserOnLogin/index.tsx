import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const SaveUserOnLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isUserSaved, setIsUserSaved] = useState(false); // Estado para recordar si el usuario ha sido guardado

  const { isLoaded, isSignedIn, user } = useUser();

  // Limpiar el estado cuando el usuario cierre sesión
  useEffect(() => {
    if (!isSignedIn) {
      setIsUserSaved(false); // Resetear el estado cuando el usuario cierre sesión
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isUserSaved) {
      const userData = {
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      };

      saveUserToDatabase(userData);
    }
  }, [isLoaded, isSignedIn, user, isUserSaved]);

  const saveUserToDatabase = async (userData: { email: string; name: string }) => {
    try {
      const response = await fetch("http://localhost:3000/saveDataUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.warn("Failed to save user to the database, User probably already exists");
      }

      setIsUserSaved(true); // Marca al usuario como guardado
      ("User saved successfully");

    } catch (error : any) {
      setError(error.message);
      ("Error saving user:", error );
    }
  };

  return null;
};

export default SaveUserOnLogin;
