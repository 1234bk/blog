import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import './add.css'
import { FaArrowLeft } from 'react-icons/fa';
const Account = () => {
  const [user] = useAuthState(auth);
  const [userBlogs, setUserBlogs] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!user) return;

      try {
        console.log("user:", user);
        const q = query(collection(db, "blogs"), where("useremail", "==", user.email));
        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map(doc => doc.data());

        setUserBlogs(blogs);

        let totalLikes = 0;
        let totalScore = 0;
        let commentCount = 0;

        blogs.forEach(blog => {
          totalLikes += blog.like || 0;
          totalScore += blog.score || 0;
          commentCount += blog.comments ? blog.comments.length : 0;
        });

        setLikeCount(totalLikes);
        setScoreCount(totalScore);
        setTotalComments(commentCount);
        // setLoading(false);
      } catch (err) {
        console.error("Firestore error:", err); // ← shows index link in console
        setError("Error fetching blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [user]);

  if (error) {
    return <p className="text-center mt-4 text-red-600">{error}</p>;
  }

  return (
    <div style={{
      background: 'linear-gradient(to bottom right,#1b4332 , #40916c, #52b788,#2d6a4f)'
    }} className="text-white p-6 w-full min-h-screen">

      {user && (
        <>


          {/* back buttom hai bhai  */}
          <div className=' w-20 mt-2 ml-8 mb-5'>
            <button
              onClick={() => window.history.back()}
              style={{

                border: 'border solid 1px',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '16px'
              }} className='flex items-center justify-center pl-2 bg-[#1b4332] border-1 border-[white] hover:bg-[#030504]  transition-colors hover:scale-105 text-white font-semibold px-6 py-2 rounded-lg shadow"
      '
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Back
            </button>
          </div>


          <h2 style={{
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontSize: '42px'
          }} className="text-3xl font-bold mb-5 text-center">Hello, {user.displayName || "User"} 👋</h2>




          <div className="flex justify-center w-full ">
            <div

              className=" transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-yellow-500 shiny-darkyellow-gradient rounded-xl p-6 shadow-md  text-black mb-3  items-center  min-w-[20rem] max-[35rem] ">
              <h1 className=" text-center  font-semibold">📊 Summary</h1>
              <div className="text-2xl flex flex-col sm:flex-row justify-around mt-4" >
                <div className="mr-5" >
                  <p>📄 Total Blogs:{userBlogs.length}</p>
                  <p>❤️ Likes: {likeCount}</p>
                </div>
                <div>
                  <p>⭐ Score: {scoreCount}</p>
                  <p>💭 Comments: {totalComments}</p>
                </div>
              </div>
            </div>
          </div>


          <div
            className="!no-underline flex flex-wrap justify-center mt-3 gap-5 text-black"
            style={{ textDecoration: 'none' }}
          >
            <Link to="/myblog" style={{ textDecoration: 'none' }}>
              <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-amber-50 shiny-red-gradient rounded-xl p-3 shadow-md  min-w-[19rem] max-[28rem] ">
                <h3 style={{ color: "#E15049" }} className="text-xl font-semibold">📄 My Blogs</h3>
              </div>
            </Link>

            <Link to="/feedback" style={{ textDecoration: 'none' }}>
              <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-amber-50 shiny-blue-gradient rounded-xl p-3 shadow-md  min-w-[19rem] max-[28rem] ">
                <h3 style={{ color: "blue" }} className="text-xl font-semibold">💬 See Feedback</h3>
              </div>
            </Link>

            <Link to="/add" style={{ textDecoration: 'none' }}>
              <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-amber-50 shiny-violet-gradient rounded-xl p-3 shadow-md  min-w-[19rem] max-[28rem] ">
                <h3 style={{ color: "violet" }} className="text-xl font-semibold">📝 Add New Blog</h3>
              </div>
            </Link>
          </div>



        </>
      )}
    </div>
  );
};

export default Account;
