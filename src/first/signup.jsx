import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../firecontext';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fb = useContext(FirebaseContext);
  // const navigate = useNavigate();


  return (
    <div className=" bg-[#b7e4c7] flex items-center justify-center h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fb.handleSignup(email, password);
        }}
        className=" bg-[#2d6a4f] border-6 border-[#d8f3dc] text-white p-8 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-semibold  mb-4 text-center">Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" bg-[#2d6a4f] w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#2d6a4f] w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
          required
        />
        <button
          type="submit"
          className="bg-[#081c15] text-white py-2  hover:bg-[#40916c]  border-3 border-[#d8f3dc] hover:border-white w-full rounded-md transition duration-300"
        >
          Create Account
        </button>
        <h1 style={{ color: "white",fontWeight: 300, fontSize: "1rem" }} className="mt-4 text-center cursor-pointer hover:underline" >
          <Link to="/signin" ><span >Login? or</span> </Link> <span  onClick={fb.handleGoogleLogin} >SignUp using google</span>
        </h1>

      </form>
    </div>
  );
};

export default Signup;
