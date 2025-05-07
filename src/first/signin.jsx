
import React, { useState, useContext } from 'react';
import { FirebaseContext } from '../firecontext';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/*************  ✨ Windsurf Command ⭐  *************/
/*******  04409609-5a3b-458f-a165-2bbe880f5525  *******/
const Signin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fb = useContext(FirebaseContext);
  const navigate = useNavigate();

  return (
    <>

      <div  className=" bg-[#b7e4c7] flex items-center justify-center h-screen ">

        <button
          onClick={() => window.history.back()}
          className= " text-white bg-[#52b788]  flex items-center gap-2 px-4 py-2 border-2 border-[#d8f3dc] rounded-md cursor-pointer fixed top-24 left-5 z-10"
        >
          <AiOutlineArrowLeft size={20} />
          <span>Back</span>
        </button>


        <form
          onSubmit={(e) => {
            e.preventDefault();
            fb.handleSignin(email, password);
          }}
          className="bg-[#2d6a4f] border-6 border-[#d8f3dc] text-white p-8 rounded-xl shadow-md w-80"
        >
          <h2 className="text-2xl mb-4 font-semibold  text-center">Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2d6a4f] w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#52b788]"
            required
          />
          <div className="flex flex-col gap-4">
            {/* <Link to="/home"> */}
            <button
              type="submit" onClick={() => navigate('/home')}
              className="bg-[#081c15] w-[15rem] text-white py-2  hover:bg-[#40916c]  border-3 border-[#d8f3dc] hover:border-white transition duration-300"
            >
              Login
            </button>

          </div>



        </form>
      </div>
    </>
  )
}

export default Signin
