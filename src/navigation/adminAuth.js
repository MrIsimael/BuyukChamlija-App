import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const isUserAdmin = async uid => {
  try {
    const adminDocRef = doc(db, 'admins', uid);
    const adminDocSnap = await getDoc(adminDocRef);
    return adminDocSnap.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const isAdmin = await isUserAdmin(user.uid);

    if (isAdmin) {
      return { success: true, user };
    } else {
      await auth.signOut(); // Sign out if not an admin
      return { success: false, error: 'User is not an admin' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
