import { createContext, useContext, useState, useEffect } from "react";
import { firebase, auth } from '../Firebase.js'
import { getUserById, createUser } from '../api/users.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      // Check if user has made account before. If not, create user in the database. Navigate to welcome.
      // If the user has made an account, but is still a "new" account, navigate to welcome.
      // Else, navigate to home.
      if (user) {
        const getResult = await getUserById(user.uid);
        if (getResult.error === 'User not found') {
          // Create user
          const createResult = await createUser({
            uid: user.uid,
            email: user.email
          });

          if (createResult) {
            setUser({
              uid: createResult.uid,
              email: createResult.email,
              is_new_user: true,
            });
          }
        } else if (getResult) {
          setUser({
            uid: getResult.uid,
            email: getResult.email,
            is_new_user: getResult.is_new_user,
          });
        } else {
          setUser(null);
        }

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
