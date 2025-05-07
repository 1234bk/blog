import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
// import { db } from '../firebase';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaLock, FaGlobe } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
const Myblog = () => {
  const [blogsQuery, setBlogsQuery] = useState(
    query(collection(db, 'blogs'))
  );
  const [user, setUser] = useState(null);
  const [imageMap, setImageMap] = useState({});
  const [blogsSnapshot, loading, error] = useCollection(blogsQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePool, setImagePool] = useState([]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If user is logged in, store user data
      } else {
        setUser(null); // If user is logged out, set to null
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);




  useEffect(() => {
    if (user) {
      let newQuery = query(
        collection(db, 'blogs'),
        where('useremail', '==', user.email) // Use user.email to filter blogs by logged-in user
      );
      setBlogsQuery(newQuery);
    }
  }, [user]);




  // Fetch image pool once
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('https://picsum.photos/v2/list?page=1&limit=1000');
        const data = await res.json();
        setImagePool(data);
      } catch (err) {
        console.error('Failed to fetch images:', err);
      }
    };

    fetchImages();
  }, []);

  // Map blog IDs to random images from the pool
  useEffect(() => {
    if (!blogsSnapshot?.docs || imagePool.length === 0) return;

    const usedIndexes = new Set();
    const getRandomImage = () => {
      let index;
      do {
        index = Math.floor(Math.random() * imagePool.length);
      } while (usedIndexes.has(index) && usedIndexes.size < imagePool.length);
      usedIndexes.add(index);
      return imagePool[index].download_url;
    };

    const map = {};
    blogsSnapshot.docs.forEach((doc) => {
      map[doc.id] = getRandomImage();
    });

    setImageMap(map);
  }, [blogsSnapshot, imagePool]);

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
    <div className='pd-4' style={{
      background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)'
    }}>

 <div className=' w-20 pt-5 ml-8 '>
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

      <h1 style={{ padding: '0', margin: '0', fontSize: '3.6rem' }} className="text-white pt-4 pb-3 w-full font-bold text-4xl sm:text-5xl lg:text-8xl text-center font-cursive animate-pulse">
        My Blogs
      </h1>

      <div className="min-h-screen w-full mx-auto pt-8 pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
        {blogsSnapshot?.docs.map((doc) => {
          const data = doc.data();
          return (
            <Link to={`/home/${doc.id}`} key={doc.id} className="!no-underline">
              <div
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
                className="hover:shadow-xl transform hover:scale-105 transition duration-300 border-3 mb-5 border-white shadow rounded flex flex-col text-white"
              >
                <div className="w-full h-64 border-2 mb-4 border-white">
                  <img
                    src={imageMap[doc.id] || "https://picsum.photos/1200/800"}
                    alt={data.topic}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 style={{ fontSize: '2.5rem' }} className="font-bold mb-4 text-center">{data.title.toUpperCase()}</h2>
                <div className="flex ml-5 mr-6 mb-2 justify-between">
                  <p className="text-xl">
                    <span className="font-semibold">Theme:</span>{' '}
                    <span className="text-[#d8f3dc]">{data.topic}</span>
                  </p>
                  <p className="text-lg mb-0 text-end">
                    <span className="font-semibold">Blog By:</span>{' '}
                    <span>{data.writtenBy}</span>
                  </p>
                </div>
                {data.public ? (
                  <p className="flex items-center justify-center">
                    <FaGlobe style={{ color: 'green', marginRight: '8px' }} />
                    Public
                  </p>
                ) : (
                  <p className="flex items-center justify-center">
                    <FaLock style={{ color: 'red', marginRight: '8px' }} />
                    Private
                  </p>
                )}

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Myblog;
