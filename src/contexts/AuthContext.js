import { createContext, useContext, useState, useEffect } from "react";
import { firebase, auth } from '../Firebase.js'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          idToken: token, // Fetch latest ID token
        });

      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle sign-out
  const handleLogout = () => {
    auth.signOut()
        .then(() => {
          console.log("User signed out");
        })
        .catch((error) => {
          console.error("Sign-out error:", error);
        });
    };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
