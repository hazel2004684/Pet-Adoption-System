import { auth, db } from "./config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// 1. SIGN UP / REGISTRATION (Adopter o Admin)
export const registerUser = async (email, password, fullName, phone) => {
  try {
    // Maghimo og user sa Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // I-save sab ang iyang detalye sa Firestore 'users' collection gamit iyang UID
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName,
      email: email,
      phone: phone,
      role: "adopter", // Default role para sa bag-ong nag-register
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    throw error.message;
  }
};

// 2. LOG IN
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error.message;
  }
};

// 3. LOG OUT
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout error: ", error);
  }
};