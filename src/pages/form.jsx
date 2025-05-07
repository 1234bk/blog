import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Make sure Firebase is correctly initialized in this file
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage imports
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({ editkarna, seteditkarna }) => {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();
  
  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const profileRef = doc(db, "profiles", user.uid);
      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setAge(data.age || '');
        setGender(data.gender || '');
          }
    };
    fetchProfile();
  }, [user]);

  // Handle image file selection
  

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    

    // Prepare profile data
    const profileRef = doc(db, "profiles", user.uid);
    const profileData = {
      name,
      age,
      gender,
      email: user.email,
     };

    // Save profile data to Firestore
    await setDoc(profileRef, profileData);

    // Set edit state to false after submission
    seteditkarna(false);
    navigate("/");
  };

  return (
    <div style={{
      background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)'
    }} 
     className=" min-h-screen flex items-center justify-center  px-4">
      <form
     style={{
      background: 'linear-gradient(to bottom right, #52B788, #93D5B8, #B7E4C7)'
    }}
      
        onSubmit={handleSubmit}
        className="border-4 border-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-[#081c15] text-center mb-3">
          Complete Your Profile
        </h2>


        {/* Form Inputs */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-black block text-sm font-medium"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full bg-[#93d5b8] border border-gray-300 rounded-lg focus:ring-[#081c15] focus:border-white"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-black"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="mt-1 p-2 w-full bg-[#93d5b8] border border-gray-300 rounded-lg focus:ring-[#081c15] focus:border-white"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-black"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="mt-1 p-2 w-full bg-[#93d5b8] border border-white rounded-lg focus:ring-[#081c15] focus:border-white"
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-around pt-4">
          <button
            type="submit"
            className="bg-[#2d6a4f] border-2 border-[#fff] text-white px-4 py-2 rounded hover:bg-[#52b788] transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => seteditkarna(false)}
            className="bg-[#2d6a4f] border-2 border-[#fff] text-white px-4 py-2 rounded hover:bg-[#52b788] transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
