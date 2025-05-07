import React, { useState, useEffect,useContext } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ProfileForm from './form';
import { sendPasswordResetEmail } from "firebase/auth";
import { signOut } from 'firebase/auth';
import { FirebaseContext } from '../firecontext';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null); // ✅ hold user in state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [editkarna, seteditkarna] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fb = useContext(FirebaseContext);


  const handleChangePassword = async () => {
    try {
      if (!user?.email) return;
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset link sent to your email.");
      navigate("/");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send reset link.");
    }
  };

  const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate("/"); // Redirects to Signin page
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

  

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch profile only when user is set
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const profileRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(profileRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setAge(data.age || '');
        setGender(data.gender || '');
        seteditkarna(false);
      } else {
        seteditkarna(true);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user,loading]);

  if (loading) {
    return (
      <div className=" w-full min-h-screen bg-[#f3faf6] flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1b4332]"></div>
        <span className="ml-2 text-[#1b4332]">Loading profile...</span>
      </div>
    );
  }

  // const handleLogout = async () => {
  // console.log('User signed out');
  //   try {
  //     await signOut(auth);
  //     navigate('/'); 
      
  //   } catch (error) {
  //     console.error('Error signing out: ', error);
  //   }
  // };

  if (editkarna) {
    return (
      <div>
        <ProfileForm editkarna={editkarna} seteditkarna={seteditkarna} />
      </div>
    );
  }

  return (
    <div  style={{
      background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)'
    }}  className="h-screen   w-full m-auto items-center justify-center bg-[#95d5b2]" >
      <div className=' w-20 ml-8 pt-5'>
     <button
      onClick={() => window.history.back()}
      style={{
       
        border: 'white solid 1px',
        color: '#007bff',
        cursor: 'pointer',
        fontSize: '16px'
      }}  className='flex items-center justify-center pl-2 bg-[#1b4332] border-1 border-[white] hover:bg-[#030504]  transition-colors hover:scale-105 text-white font-semibold px-6 py-2 rounded-lg shadow"
 '
    >
      <FaArrowLeft style={{ marginRight: '8px' }} />
      Back
    </button>
    </div>


    <div className="h-[75%] flex items-center justify-center ">
    <div 
    style={{
      background: 'linear-gradient(to bottom right, #52B788, #93D5B8, #B7E4C7)'
    }}
     
    className=" border-4 border-white rounded-xl shadow-lg p-8 w-full max-w-md">
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' , color: '#081c15'}} className="text-[3rem] mb-5 font-bold text-[#fdfdfd] border-b border-[#2d6a4f] pb-2">
       My Profile
      </h2>
  
      <div className="space-y-3 mb-5 text-[#081c15]">
        <div><span className="font-semibold text-[#1b4332]">Name:</span> {name}</div>
        <div><span className="font-semibold text-[#1b4332]">Age:</span> {age}</div>
        <div><span className="font-semibold text-[#1b4332]">Gender:</span> {gender}</div>
        <div><span className="font-semibold text-[#1b4332]">Email:</span> {user?.email}</div>
      </div>
    <div className="flex justify-around mt-6" >
      <button
        onClick={() => seteditkarna(true)}
        className=" bg-[#40916c] hover:bg-[#2d6a4f] hover:border-3 border-amber-100 text-white px-4 py-2 rounded-md transition"
      >
        Edit Profile
      </button>
      <button
    onClick={handleChangePassword}
    className=" bg-[#40916c] hover:bg-[#2d6a4f] hover:border-3 border-amber-100 text-white px-4 py-2 rounded-md transition"
    >
    Change Password
  </button>
      </div>
    </div>
    
  </div>
  <div className="flex justify-center ">
  <button
        onClick={handleLogout}
        className="bg-[#1b4332] hover:bg-[#081c15] text-white font-semibold border-2 border-amber-100 px-4 py-2 rounded "
      >
        Logout
      </button>
      </div>

  </div>


  );
};

export default Profile;
