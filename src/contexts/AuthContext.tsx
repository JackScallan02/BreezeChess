import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { firebase, auth } from '../Firebase'
import { getUsers, getUserById, createUser } from '../api/users';
import { UserParams, User, CreateUserData } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  handleUserUpdate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fbUser: the logged-in firebase user object
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser: firebase.User | null) => {
      // Check if user has made account before. If not, create user in the database. Navigate to welcome.
      // If the user has made an account, but is still a "new" account, navigate to welcome.
      // Else, navigate to home.
      try {
        if (!fbUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (fbUser) {
          const params: UserParams = {
            uid: fbUser.uid,
            email: null,
            password: null, // Only provide password when signing in, for password validation
          }
          const getResult = await getUsers(params);
          if (getResult.error === 'User not found') {
            // Create user
            let createResult;
            if (fbUser.providerData && fbUser.providerData[0]) {
              if (fbUser.providerData[0].providerId === 'password') {
                const newUser: CreateUserData = {
                  uid: fbUser.uid,
                  username: null,
                  email: fbUser.email,
                  password,
                  provider: fbUser.providerData[0].providerId,
                }
                createResult = await createUser(newUser);
  
              } else {
                const newUser: CreateUserData = {
                  uid: fbUser.uid,
                  username: null,
                  email: fbUser.email,
                  password: null,
                  provider: fbUser.providerData[0].providerId,
                }
                createResult = await createUser(newUser);
              }
              if (createResult) {
                setUser({
                  id: createResult.id,
                  email: createResult.email,
                  username: null,
                  is_new_user: createResult.is_new_user,
                });
              }
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
      } catch (error) {
        setUser(null);
      }
      
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [password]);

  const handleUserUpdate = async () => {
    if (user) {
      const getResult = await getUserById(user.id);
      console.log("getResult", getResult);

      setUser({
        id: getResult.id,
        email: getResult.email,
        username: getResult.username,
        is_new_user: getResult.is_new_user,
      });
    }
  }

  // Handle sign-out
  const handleLogout = () => {
    auth.signOut()
        .then(() => {
          console.log("User signed out");
          setLoading(false);
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
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
