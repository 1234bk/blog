import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import './add.css'
import { FaArrowLeft } from 'react-icons/fa';

const Add = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    isPublic: true,
    writtenBy: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to post a blog.");
      return;
    }

    try {
      const blogData = {
        userid: user.uid,
        useremail: user.email,
        title: formData.title,
        description: formData.description,
        topic: formData.topic,
        writtenBy: formData.writtenBy,
        like: 0,
        score:0,
        comments: [],
        feedback: [],
        public: formData.isPublic,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'blogs'), blogData);
      alert("Blog posted successfully!");

      setFormData({
        title: '',
        description: '',
        topic: '',
        isPublic: true,
        writtenBy: '',
      });

    } catch (err) {
      console.error(err);
      alert("Error posting blog");
    }
  };

  const clearkaro = () => {
    setFormData({
      title: '',
      description: '',
      topic: '',
      isPublic: true,
      writtenBy: '',
    });
  };


  return (
    <>
    

    <div  style={{
    background: 'linear-gradient(to bottom right, #40916c, #52b788,#2d6a4f,#1b4332 )'
  }} className=' w-full min-h-screen inline-block items-center justify-center cursor-wait pt-5 ' >
   
   <div className=' w-20 ml-8 mb-5'>
     <button
      onClick={() => window.history.back()}
      style={{
        
          background: 'linear-gradient(to bottom right, #2D6A4F, #55A280, #1B4332)',

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

    <form onSubmit={handleSubmit} className=" border-4 border-[#ffffff] max-w-xl mx-auto p-6 mb-12 bg-[#2d6a4f] shadow-lg rounded-xl  ">
    <h2  className=" header  font-bold text-center text-white p-1">Add New Blog</h2>
  
    <input
      type="text"
      name="title"
      placeholder="Blog Title"
      className="w-full p-2 border-2  inp border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
      value={formData.title}
      onChange={handleChange}
      required
      
    />
  
    <textarea
      name="description"
      placeholder="Short Description"
      className="w-full p-2 border-2 inp border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
      rows="4"
      value={formData.description}
      onChange={handleChange}
      required
    />
  
    <select
      name="topic"
      className="w-full p-2 border-2 inp border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
      value={formData.topic}
      onChange={handleChange}
    >
      <option disabled value="" >Select Theme</option>
      <option value="Technology">Technology</option>
      <option value="Travel">Travel</option>
      <option value="Food">Food</option>
      <option value="Sports">Sports</option>
      <option value="Nature">Nature</option>
      <option value="Other">Other</option>
    </select>
  
  

   
  <label className="w-50 text-gray-700 font-medium">
  <div className="flex justify-around items-center mt-4">
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="isPublic"
        value="true"
        checked={formData.isPublic === true}
        onChange={() => setFormData({ ...formData, isPublic: true })}
        className="accent-[#1b4332] w-5 h-5"
      />
      <span className="text-white sp "  >Public</span>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        name="isPublic"
        value="false"
        checked={formData.isPublic === false}
        onChange={() => setFormData({ ...formData, isPublic: false })}
        className="accent-[#1b4332] w-5 h-5"
      />
      <span className="text-white sp" >Private</span>
    </div>
    </div>
  </label>



  
    <input
      type="text"
      name="writtenBy"
      placeholder="Blog Written By"
      className="w-full p-2 border-2 inp border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
      value={formData.writtenBy}
      onChange={handleChange}
      required
    />
  
    <div className="flex justify-around mt-5">
      <button
        type="submit"
        className="bg-[#1b4332] border-1 border-[white] hover:bg-[#030504]  transition-colors hover:scale-105 text-white font-semibold px-6 py-2 rounded-lg shadow"
      >
        Submit Blog
      </button>
      <button
        type="button"
        onClick={clearkaro}
        className="bg-[#1b4332] border-1 border-[white] hover:bg-[#030504]  transition-colors  hover:scale-105 text-white font-semibold px-6 py-2 rounded-lg shadow"
      >
        Cancel
      </button>
    </div>
  </form>
  </div>
  </>
  );
};

export default Add;
