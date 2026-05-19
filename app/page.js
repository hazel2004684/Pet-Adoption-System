"use client";

import { useState, useEffect } from "react";
import { db, auth } from "./src/services/firebase/config";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Authentication from "./src/authentication";

export default function Home() {
  const [role, setRole] = useState(""); // "admin" or "customer"
  const [user, setUser] = useState(null); // Holds the logged-in user
  const [isAuthView, setIsAuthView] = useState(false); // Toggles the auth screen

  const handleAuthSuccess = (loggedUser) => {
    if (loggedUser) {
      setUser(loggedUser);
    }
    setIsAuthView(false);
  };

  // PET DATABASE STATES
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", breed: "", age: "", gender: "" });

  // 1. Monitor user login and realtime data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setRole(""); 
        setIsAuthView(false);
      }
    });

    const petCollectionRef = collection(db, "pet");
    const unsubscribeDocs = onSnapshot(petCollectionRef, (snapshot) => {
      const fetchedPets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(fetchedPets);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDocs();
    };
  }, []);

  // 2. GOOGLE AUTHENTICATION FUNCTION
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // 3. CRUD PET FUNCTIONS
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addPet = async () => {
    if (!form.name || !form.breed) return alert("Please provide Name and Breed!");
    try {
      await addDoc(collection(db, "pet"), {
        name: form.name,
        breed: form.breed,
        age: form.age || "N/A",
        gender: form.gender || "N/A",
        status: "Available",
        createdAt: serverTimestamp(),
      });
      setForm({ id: null, name: "", breed: "", age: "", gender: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const updatePet = async () => {
    if (!form.id) return;
    try {
      await updateDoc(doc(db, "pet", form.id), {
        name: form.name,
        breed: form.breed,
        age: form.age,
        gender: form.gender,
      });
      setForm({ id: null, name: "", breed: "", age: "", gender: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const deletePet = async (id) => {
    if (!confirm("Are you sure you want to delete this pet?")) return;
    try {
      await deleteDoc(doc(db, "pet", id));
    } catch (error) {
      console.error(error);
    }
  };

  const adoptPet = async (id) => {
    try {
      await updateDoc(doc(db, "pet", id), { status: "Adopted" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4 sm:p-6 lg:p-8 text-black">

      {/* STEP 1: ROLE SELECT SCREEN */}
      {!role && !isAuthView && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center max-w-md mx-auto px-4">
          <div className="bg-pink-50 p-8 rounded-3xl shadow-xl w-full border-4 border-pink-300">
            <h1 className="text-3xl font-black text-black mb-2">🐾 Pet Adoption</h1>
            <p className="text-black font-medium mb-6 text-sm">Choose your role to get started.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setRole("admin"); setIsAuthView(true); }}
                className="bg-pink-400 hover:bg-pink-500 text-black font-black px-6 py-3.5 rounded-xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Admin Dashboard
              </button>

              <button
                onClick={() => { setRole("customer"); setIsAuthView(true); }}
                className="bg-pink-300 hover:bg-pink-400 text-black font-black px-6 py-3.5 rounded-xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Customer View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: GOOGLE AUTHENTICATION GATE (Updated: simpler view) */}
      {isAuthView && !user && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-md mx-auto px-4">
          <Authentication
            role={role}
            onSuccess={handleAuthSuccess}
            onCancel={() => { setIsAuthView(false); setRole(""); }}
          />
        </div>
      )}

      {role && !user && !isAuthView && (
        <div className="flex items-center justify-center min-h-[70vh] px-4">
          <div className="bg-pink-50 p-6 rounded-3xl border-4 border-pink-300 shadow-xl text-center">
            <p className="text-lg font-black text-black">Signing in...</p>
            <p className="text-sm text-neutral-700 mt-2">Please wait while we complete sign in.</p>
          </div>
        </div>
      )}

      {/* STEP 3: MAIN DASHBOARD */}
      {role && user && (
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-pink-50 p-4 rounded-2xl border-4 border-pink-300 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-black" />
              ) : (
                <span className="text-2xl">🐶</span>
              )}
              <div>
                <h1 className="text-xl font-black text-black tracking-wide">
                  {role.toUpperCase()} DASHBOARD
                </h1>
                <p className="text-xs font-bold text-neutral-700 truncate max-w-[250px] sm:max-w-none">
                  User: {user.displayName || user.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-300 hover:bg-red-400 text-black border-2 border-black px-4 py-2 rounded-xl text-sm font-black transition active:scale-95"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* ADMIN FORM */}
          {role === "admin" && (
            <div className="bg-pink-50 p-5 sm:p-6 rounded-2xl border-4 border-pink-300 shadow-md mb-6 transition-all">
              <h2 className="font-black text-lg mb-4 text-black flex items-center gap-2">
                {form.id ? "📝 Edit Pet Information" : "✨ Register New Pet"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  name="name"
                  placeholder="Pet Name"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  name="breed"
                  placeholder="Breed (e.g., Mixed-breed)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none"
                  value={form.breed}
                  onChange={handleChange}
                />
                <input
                  name="age"
                  placeholder="Age (e.g., 2 years)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none"
                  value={form.age}
                  onChange={handleChange}
                />
                <input
                  name="gender"
                  placeholder="Gender (Male / Female)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none"
                  value={form.gender}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {!form.id ? (
                  <button
                    onClick={addPet}
                    className="bg-pink-400 hover:bg-pink-500 text-black border-2 border-black px-6 py-2.5 rounded-xl font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
                  >
                    + Add Pet
                  </button>
                ) : (
                  <button
                    onClick={updatePet}
                    className="bg-pink-300 hover:bg-pink-400 text-black border-2 border-black px-6 py-2.5 rounded-xl font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
                  >
                    💾 Save Changes
                  </button>
                )}
                
                {form.id && (
                  <button
                    onClick={() => setForm({ id: null, name: "", breed: "", age: "", gender: "" })}
                    className="bg-pink-200 hover:bg-pink-300 text-black border-2 border-black px-6 py-2.5 rounded-xl font-black text-sm transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PET LIST SECTION */}
          <h2 className="text-xl font-black text-black mb-4 tracking-tight flex items-center gap-2">
            🐾 List of Pets ({pets.length})
          </h2>

          {pets.length === 0 ? (
            <div className="text-center bg-pink-50 p-10 rounded-2xl border-4 border-pink-300 text-black">
              <p className="text-3xl mb-2">🏝️</p>
              <p className="font-black text-sm">No pets in the list.</p>
              {role === "admin" && <p className="text-xs font-bold mt-1">Try adding one using the form above.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-pink-50 p-5 rounded-2xl border-4 border-pink-300 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="text-lg font-black text-black truncate">{pet.name}</h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-black border-2 border-black tracking-wider ${
                          pet.status === "Available" ? "bg-pink-200 text-black" : "bg-pink-400 text-black line-through"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border-2 border-pink-200 space-y-1.5 text-sm text-black font-bold">
                      <p><span className="text-neutral-800 font-black">Breed:</span> {pet.breed}</p>
                      <p><span className="text-neutral-800 font-black">Age:</span> {pet.age}</p>
                      <p><span className="text-neutral-800 font-black">Gender:</span> {pet.gender}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t-2 border-pink-200">
                    {role === "customer" && (
                      pet.status === "Available" ? (
                        <button
                          onClick={() => adoptPet(pet.id)}
                          className="w-full bg-pink-400 hover:bg-pink-500 text-black border-2 border-black py-2.5 rounded-xl font-black text-sm transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        >
                          Adopt Me 💕
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-pink-200 text-neutral-800 border-2 border-dashed border-neutral-800 py-2.5 rounded-xl font-black text-sm cursor-not-allowed"
                        >
                          Already Adopted 🏠
                        </button>
                      )
                    )}

                    {role === "admin" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setForm(pet)}
                          className="bg-pink-300 hover:bg-pink-400 text-black border-2 border-black py-2 rounded-xl text-sm font-black transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePet(pet.id)}
                          className="bg-pink-400 hover:bg-pink-500 text-black border-2 border-black py-2 rounded-xl text-sm font-black transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}