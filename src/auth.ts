import { auth, GoogleAuthProvider, signInWithPopup } from './firebase';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const signOut = async () => {
  try {
    return auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
};
