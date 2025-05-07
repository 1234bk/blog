import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const Home = () => {
  const [blogsQuery, setBlogsQuery] = useState(
    query(collection(db, 'blogs'), where('public', '==', true))
  );
  const [imageMap, setImageMap] = useState({});
  const [blogsSnapshot, loading, error] = useCollection(blogsQuery);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePool, setImagePool] = useState([]);

  useEffect(() => {
    let newQuery;

    if (searchTerm === '') {
      newQuery = query(collection(db, 'blogs'), where('public', '==', true));
    } else if (searchTerm === 'like') {
      newQuery = query(
        collection(db, 'blogs'),
        where('public', '==', true),
        orderBy('like', 'desc')
      );
    } else if (searchTerm === 'score') {
      newQuery = query(
        collection(db, 'blogs'),
        where('public', '==', true),
        orderBy('score', 'desc')
      );
    } else {
      newQuery = query(
        collection(db, 'blogs'),
        where('public', '==', true),
        where('topic', '==', searchTerm)
      );
    }

    setBlogsQuery(newQuery);
  }, [searchTerm]);

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
      <div style={{
        background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)' 
      }} className="opacity-80 z-10 w-[15rem] h-[3.1rem] fixed top-26 right-15 text-white flex items-center px-2 rounded-xl gap-1">
        <label htmlFor="search-select" className="font-medium">Search by:</label>
        <select
          id="search-select"
          className="bg-[#1e723b] border border-gray-300 rounded px-2 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        >
          <option value="">All</option>
          <option value="like">Most Liked</option>
          <option value="score">Highest Score</option>
          <option value="Technology">Technology</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Sports">Sports</option>
          <option value="Nature">Nature</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={{ width: '100%', height: '74vh', padding: '0', margin: '0' }}>
        <img
          src="https://wallpapers.com/images/hd/green-sky-in-the-night-21k3vd1eic7fe0eg.jpg"
          alt="Banner"
          style={{ width: '100%', height: '100%', padding: '0', margin: '0' }}
        />
        <div className="absolute top-49 inset-0 inline items-center justify-center">
          <h1 style={{ fontSize: '3.6rem' }} className="text-white text-6xl sm:text-7xl lg:text-8xl font-bold italic drop-shadow-xl text-center">
            Welcome to my blog
          </h1>
          <h3 style={{ color: '#cbeada', fontSize: '1.6rem' }} className='text-[#d8f3dc] text-xl sm:text-2xl lg:text-3xl font-bold italic drop-shadow-xl text-center'>
            A space for dreamers, thinkers and creators. Let's explore the beauty of life and ideas together.
          </h3>
        </div>
        <div className='absolute inset-0 flex items-end mb-32 justify-end'>
          <h5 style={{ color: '#cbeada', fontSize: '.9rem' }} className='text-[#d8f3dc] italic drop-shadow-xl text-end'>developed by bk...</h5>
        </div>
      </div>

      <h1 style={{ padding: '0', margin: '0', fontSize: '3.6rem' }} className="text-white mt-4 w-full font-bold text-4xl sm:text-5xl lg:text-8xl text-center font-cursive animate-pulse">
        Recent Blogs
      </h1>

      <div className="min-h-screen w-full mx-auto pt-8 pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      : 'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)'  }}
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
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
