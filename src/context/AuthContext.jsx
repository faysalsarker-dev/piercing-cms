/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  browserLocalPersistence,
   browserSessionPersistence,
   setPersistence

} from "firebase/auth";


import app from "../config/firebase.config";
import { ContextData } from "./../utility/ContextData";

const auth = getAuth(app);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);



// Create user with email and password
  const createUser = async (email, password) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const signIn = async (email, password,rememberMe = false) => {
    setLoading(true);
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence); 
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const profileUpdate = async (name, photo) => {
    setLoading(true);
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    const updatedUser = {
      ...auth.currentUser,
      displayName: name,
      photoURL: photo,
    };
    setUser(updatedUser);
  };

  // Log out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };





 


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        
        setLoading(false);
      } else {
        setLoading(false);
        setUser(null);
       
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  const contextData = {
    createUser,
    signIn,
    user,
    logOut,
    loading,
    setLoading,
    setUser,
    profileUpdate
  };

  return (
    <ContextData.Provider value={contextData}>
      {children}
    </ContextData.Provider>
  );
};

export default AuthContext;
