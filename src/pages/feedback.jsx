import React, { useEffect, useState } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { FaArrowLeft, FaLock, FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Feedback = () => {
  const [user, setUser] = useState(null);
  const [blogsQuery, setBlogsQuery] = useState(query(collection(db, 'blogs')));
  const [blogsSnapshot, loading, error] = useCollection(blogsQuery);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const userBlogsQuery = query(
        collection(db, 'blogs'),
        where('userid', '==', user.uid) // Assuming `userid` is stored in blogs
      );
      setBlogsQuery(userBlogsQuery);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f3faf6] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1b4332]"></div>
        <span className="ml-2 text-[#1b4332]">Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    console.error("Firestore error:", error);
    return <p className="text-center mt-4 text-red-600">Error fetching blogs.</p>;
  }

  return (
    <div className="pd-4 min-h-screen w-full  " style={{ background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)' }}>
      
      <div className="w-20 pt-5 ml-8">
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'linear-gradient(to bottom right, #2D6A4F, #55A280, #1B4332)',
            border: 'white solid 1px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          className="flex items-center justify-center pl-2 hover:bg-[#030504] transition-colors hover:scale-105 text-white font-semibold px-6 py-2 rounded-lg shadow"
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>
      </div>

      <h1 style={{ fontSize: '3rem' }} className="text-white pt-4 pb-3 w-full font-bold text-3xl sm:text-5xl lg:text-9xl text-center font-cursive animate-pulse">
        Blogs with Feedbacks
      </h1>

      <div className="mx-auto  p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogsSnapshot?.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(blog => blog.feedback && blog.feedback.length > 0)
          .map((data) => (
            <div
              key={data.id}
              style={{
                background:
                  data.topic === 'Technology'
                    ? 'linear-gradient(to bottom right, #1e1b4b, #4f46e5, #818cf8)'
                    : data.topic === 'Travel'
                    ? 'linear-gradient(to bottom right, #0f766e, #14b8a6, #5eead4)'
                    : data.topic === 'Sports'
                    ? 'linear-gradient(to bottom right, #7f1d1d, #dc2626, #f87171)'
                    : data.topic === 'Food'
                    ? 'linear-gradient(to bottom right, #78350f, #f59e0b, #fde68a)'
                    : data.topic === 'Nature'
                    ? 'linear-gradient(to bottom right, #064e3b, #10b981, #6ee7b7)'
                    : 'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)'
              }}
              className="hover:shadow-xl transform hover:scale-105 transition duration-300 border-3 mb-5 border-white shadow rounded flex flex-col text-white px-5 pb-4"
            >
              <h2 style={{ fontSize: '2.3rem' }} className="font-bold mt-4 mb-2 text-center text-[3rem]">{data.title.toUpperCase()}</h2>

              <div className="flex justify-between mt-3 text-lg">
                <p>
                  <span className="font-semibold">Theme:</span>{' '}
                  <span className="text-[#d8f3dc]">{data.topic}</span>
                </p>
                <p>
                  <span className="font-semibold">By:</span>{' '}
                  <span>{data.writtenBy}</span>
                </p>
              </div>

              

              <div className=''>
                <h3 className="text-lg font-semibold mb-2 text-[#fefae0]">Feedbacks:</h3>
                <ul className="list-disc list-inside text-white space-y-1">
                  {data.feedback.map((fb, i) => (
                    <li key={i}>{fb}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Feedback;
