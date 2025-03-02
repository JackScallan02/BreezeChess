import { createContext, useContext, useState, useEffect } from "react";
import { firebase, auth } from '../Firebase.js'
import { getUsers, getUserById, createUser } from '../api/users.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser) => {
      // Check if user has made account before. If not, create user in the database. Navigate to welcome.
      // If the user has made an account, but is still a "new" account, navigate to welcome.
      // Else, navigate to home.
      if (fbUser) {
        const getResult = await getUsers({uid: fbUser.uid});
        if (getResult.error === 'User not found') {
          // Create user
          let createResult;
          if (fbUser.providerData[0].providerId === 'password') {
            createResult = await createUser({
              uid: fbUser.uid,
              email: fbUser.email,
              password,
              provider: fbUser.providerData[0].providerId,
            });
          } else {
            createResult = await createUser({
              uid: fbUser.uid,
              email: fbUser.email,
              provider: fbUser.providerData[0].providerId,
            });
          }

          if (createResult) {
            setUser({
              id: createResult.id,
              email: createResult.email,
              username: null,
              is_new_user: createResult.is_new_user,
            });
          }
        } else if (getResult) {
          setUser({
            id: getResult.id,
            email: getResult.email,
            username: getResult.username,
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
  }, [password]);

  const handleUserUpdate = async () => {
    const getResult = await getUserById(user.id);

    setUser({
      id: getResult.id,
      email: getResult.email,
      username: getResult.username,
      is_new_user: getResult.is_new_user,
    });
  }

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
    <AuthContext.Provider value={{ user, loading, password, setPassword, setLoading, handleLogout, handleUserUpdate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
