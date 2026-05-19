"use client";

import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("");
  
  // MOCK DATA: Pure frontend state with pink-themed default data if needed
  const [pets, setPets] = useState([
    { id: 1, name: "Bantay", breed: "Askal", age: "2 years", gender: "Male", status: "Available" },
    { id: 2, name: "Muning", breed: "Persian Cat", age: "1 year", gender: "Female", status: "Adopted" },
    { id: 3, name: "Chikititing", breed: "Shih Tzu", age: "5 months", gender: "Female", status: "Available" },
  ]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    breed: "",
    age: "",
    gender: "",
  });

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE / ADD PET
  const addPet = () => {
    if (!form.name || !form.breed) {
      alert("Palihug butangi og Name ug Breed!");
      return;
    }

    const newPet = {
      id: Date.now(),
      name: form.name,
      breed: form.breed,
      age: form.age || "N/A",
      gender: form.gender || "N/A",
      status: "Available",
    };

    setPets([...pets, newPet]);
    setForm({ id: null, name: "", breed: "", age: "", gender: "" });
  };

  // UPDATE PET
  const updatePet = () => {
    if (!form.id) return;

    setPets(
      pets.map((pet) =>
        pet.id === form.id
          ? { ...pet, name: form.name, breed: form.breed, age: form.age, gender: form.gender }
          : pet
      )
    );

    setForm({ id: null, name: "", breed: "", age: "", gender: "" });
  };

  // DELETE PET
  const deletePet = (id) => {
    if (!confirm("Sigurado ka nga gusto nimo i-delete kini nga pet?")) return;
    setPets(pets.filter((pet) => pet.id !== id));
  };

  // ADOPT PET
  const adoptPet = (id) => {
    setPets(
      pets.map((pet) =>
        pet.id === id ? { ...pet, status: "Adopted" } : pet
      )
    );
  };

  return (
    <div className="min-h-screen bg-pink-100 p-4 sm:p-6 lg:p-8 text-black">

      {/* ROLE SELECT (ALL PINK + BLACK TEXT) */}
      {!role && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center max-w-md mx-auto px-4">
          <div className="bg-pink-50 p-8 rounded-3xl shadow-xl w-full border-4 border-pink-300">
            <h1 className="text-3xl font-black text-black mb-2">🐾 Pet Adoption</h1>
            <p className="text-black font-medium mb-6 text-sm">Pilia kung unsa imong role aron makasugod.</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setRole("admin")}
                className="bg-pink-400 hover:bg-pink-500 text-black font-black px-6 py-3.5 rounded-xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Admin Dashboard
              </button>

              <button
                onClick={() => setRole("customer")}
                className="bg-pink-300 hover:bg-pink-400 text-black font-black px-6 py-3.5 rounded-xl transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Customer View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN DASHBOARD */}
      {role && (
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-pink-50 p-4 rounded-2xl border-4 border-pink-300 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐶</span>
              <h1 className="text-xl font-black text-black tracking-wide">
                {role.toUpperCase()} DASHBOARD
              </h1>
            </div>

            <button
              onClick={() => {
                setRole("");
                setForm({ id: null, name: "", breed: "", age: "", gender: "" });
              }}
              className="w-full sm:w-auto bg-pink-200 hover:bg-pink-300 text-black border-2 border-black px-5 py-2 rounded-xl text-sm font-black transition active:scale-95"
            >
              🔄 Change Role
            </button>
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
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  name="breed"
                  placeholder="Breed (e.g., Askal)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={form.breed}
                  onChange={handleChange}
                />

                <input
                  name="age"
                  placeholder="Age (e.g., 2 years)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={form.age}
                  onChange={handleChange}
                />

                <input
                  name="gender"
                  placeholder="Gender (Male / Female)"
                  className="border-2 border-black p-3 rounded-xl bg-white text-black placeholder-neutral-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              <p className="font-black text-sm">Walay pets sa listahan.</p>
              {role === "admin" && <p className="text-xs font-bold mt-1">Sulayi pag-add gamit ang form sa babaw.</p>}
            </div>
          ) : (
            /* RESPONSIVE GRID FOR PET CARDS */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-pink-50 p-5 rounded-2xl border-4 border-pink-300 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h3 className="text-lg font-black text-black truncate">{pet.name}</h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-black border-2 border-black tracking-wider ${
                          pet.status === "Available"
                            ? "bg-pink-200 text-black"
                            : "bg-pink-400 text-black line-through"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </div>

                    {/* CARD DETAILS */}
                    <div className="bg-white p-3 rounded-xl border-2 border-pink-200 space-y-1.5 text-sm text-black font-bold">
                      <p><span className="text-neutral-800 font-black">Breed:</span> {pet.breed}</p>
                      <p><span className="text-neutral-800 font-black">Age:</span> {pet.age}</p>
                      <p><span className="text-neutral-800 font-black">Gender:</span> {pet.gender}</p>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="mt-5 pt-3 border-t-2 border-pink-200">
                    
                    {/* CUSTOMER ACTIONS */}
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

                    {/* ADMIN ACTIONS */}
                    {role === "admin" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setForm(pet)}
                          className="bg-pink-300 hover:bg-pink-400 text-black border-2 border-black py-2 rounded-xl text-sm font-black transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                        >
                          Edit
                        </button>
                        
                        <button
                          onClick={() => deletePet(pet.id)}
                          className="bg-pink-400 hover:bg-pink-500 text-black border-2 border-black py-2 rounded-xl text-sm font-black transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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