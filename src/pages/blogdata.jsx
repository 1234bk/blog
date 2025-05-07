import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaHeart } from 'react-icons/fa';

import { FaArrowLeft } from 'react-icons/fa';

function Blogdata() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlog(data);
        setLikes(data.like || 0);
        setScore(data.score || 0);
      } else {
        console.log('No such document!');
      }
    };
    fetchBlog();
  }, [id]);

  const toggleLike = async () => {
    if (!blog) return;
    const newLikeCount = liked ? likes - 1 : likes + 1;
    setLikes(newLikeCount);
   
    const newscore = liked ? score - 1 : score + 1;
    setScore(newscore);

    setLiked(!liked);
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      like: newLikeCount,
      score:newscore
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const updatedComments = [...(blog.comment || []), newComment];
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      comment: updatedComments,
    });
    setBlog({ ...blog, comment: updatedComments });

    setNewComment('');

    const newscore =  score + 2;
    const blogref = doc(db, 'blogs', id);
    await updateDoc(blogref, {
      
      score:newscore
    });
  };

  const handleAddFeedback = async () => {
    if (!newFeedback.trim()) return;
    const updatedFeedback = [...(blog.feedback || []), newFeedback];
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      feedback: updatedFeedback,
    });
    setBlog({ ...blog, feedback: updatedFeedback });
    setNewFeedback('');

    const newscore =  score + 3;
    const blogref = doc(db, 'blogs', id);
    await updateDoc(blogref, {
      
      score:newscore
    });
  };

  if (!blog) {
    return (
      <div className="w-full min-h-screen flex justify-center items-start mt-30 h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1b4332]"></div>
        <span className="ml-2 text-[#1b4332]">Loading data...</span>
      </div>
    );
  }

  return (
    <div 
    style={{
      background:
        blog.topic === 'Technology'
          ? 'linear-gradient(to bottom right, #1e1b4b, #4f46e5, #818cf8)'
          : blog.topic === 'Travel'
          ? 'linear-gradient(to bottom right, #0f766e, #14b8a6, #5eead4)'
          : blog.topic === 'Sports'
          ? 'linear-gradient(to bottom right, #7f1d1d, #dc2626, #f87171)'
          : blog.topic === 'Food'
          ? 'linear-gradient(to bottom right, #78350f, #f59e0b, #fde68a)'
          : blog.topic === 'Nature'
          ? 'linear-gradient(to bottom right, #064e3b, #10b981, #6ee7b7)'
          :  'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)'
  }}
    className="w-full min-h-screen text-white  mx-auto p-6 pb-20 space-y-6">
      {/* Blog Title */}



{/* back bttn */}
      <div className='w-20 ml-8 mb-5'>
           <button
            onClick={() => window.history.back()}

            style={{
              background:
                blog.topic === 'Technology'
                  ? 'linear-gradient(to bottom right, #818cf8, #4f46e5, #1e1b4b)'
                  : blog.topic === 'Travel'
                  ? 'linear-gradient(to bottom right, #5eead4, #14b8a6, #0f766e)'
                  : blog.topic === 'Sports'
                  ? 'linear-gradient(to bottom right , #f87171  , #dc2626, #7f1d1d)'
                  : blog.topic === 'Food'
                  ? 'linear-gradient(to bottom right , #fde68a , #f59e0b , #78350f)'
                  : blog.topic === 'Nature'
                  ? 'linear-gradient(to bottom right, #6ee7b7 , #10b981 , #064e3b)'
                  : 'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)'
                ,
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '16px',
              border: 'white 1 px solid '
            }}  className='flex items-center justify-center pl-2 bg-[#1b4332] border-1 border-[white] hover:bg-[#030504]  transition-colors hover:scale-115 text-white font-semibold px-6 py-2 rounded-lg shadow"
       '
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back
          </button>
          </div>
      <div className='border-4 max-w-[80%] mx-auto  bg-white/20 backdrop-blur-md   transition-transform duration-300  border-[#fff] p-4'>
      <h1 style={{fontSize: '4rem'}}  className=" font-bold  text-center">{blog.title.toUpperCase()}</h1>

      {/* Blog Theme and Author */}
      <div className="text-lg flex opacity-90 justify-between mt-4 gap-4">
        <span>Theme: {blog.topic}</span>
        <span>Written by: {blog.writtenBy}</span>
      </div>

      {/* Blog Content */}
      <div className="text-xl text-white p-4 border-1 mt-5 border-[#fff] rounded-lg">
        {blog.description}
      </div></div>


      {/* Like Button */}
      <div className="text-xl max-w-[80%] mx-auto flex items-center mt-4">
        <button
          onClick={toggleLike}
         
          className={`p-2 rounded-full transition ${
            liked ? 'text-red-500' : 'text-white'  
          }` }
        >
          <FaHeart   fill={liked ? 'red' : 'white'  } />
        </button>
        <span className="font-medium">{likes} Likes</span>
      </div>



      {/* Comments */}
      <div className="max-h-40 mt-10  max-w-[80%] mx-auto text-lg   overflow-y-auto border rounded-lg p-3  space-y-2 shadow">
        <h1 className='text-lg, text-center' >Comment section</h1>
        {(blog.comment || []).map((comment, index) => (
          <div key={index} className="text-lg">
            {comment}
          </div>
        ))}
        <div className="  flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Add comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-1 border-2 border-[#fff]  focus:outline-none focus:ring-2 focus:ring-[#fff]"
          />
          <button
            onClick={handleAddComment}
            style={{
              background:
                blog.topic === 'Technology'
                  ? 'linear-gradient(to bottom right, #818cf8, #4f46e5, #1e1b4b)'
                  : blog.topic === 'Travel'
                  ? 'linear-gradient(to bottom right, #5eead4, #14b8a6, #0f766e)'
                  : blog.topic === 'Sports'
                  ? 'linear-gradient(to bottom right , #f87171  , #dc2626, #7f1d1d)'
                  : blog.topic === 'Food'
                  ? 'linear-gradient(to bottom right , #fde68a , #f59e0b , #78350f)'
                  : blog.topic === 'Nature'
                  ? 'linear-gradient(to bottom right, #6ee7b7 , #10b981 , #064e3b)'
                  : 'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)',
                  border:'white 1px solid'
            }}
            className="bg-[#1b4332] text-white px-3 py-1 "
          >
            Post
          </button>
        </div>
      </div>



      {/* Feedback Section */}
      <div className='mt-15 max-w-[80%] mx-auto'>
        <h2 className="text-lg  font-semibold mb-3">Give personal Feedback</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Your feedback..."
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            className="flex-1 px-3 py-1 border-2 border-[#fff] focus:outline-none focus:ring-2 focus:ring-[#fff]"
          />
          <button
             style={{
              background:
                blog.topic === 'Technology'
                  ? 'linear-gradient(to bottom right, #818cf8, #4f46e5, #1e1b4b)'
                  : blog.topic === 'Travel'
                  ? 'linear-gradient(to bottom right, #5eead4, #14b8a6, #0f766e)'
                  : blog.topic === 'Sports'
                  ? 'linear-gradient(to bottom right , #f87171  , #dc2626, #7f1d1d)'
                  : blog.topic === 'Food'
                  ? 'linear-gradient(to bottom right , #fde68a , #f59e0b , #78350f)'
                  : blog.topic === 'Nature'
                  ? 'linear-gradient(to bottom right, #6ee7b7 , #10b981 , #064e3b)'
                  : 'linear-gradient(to bottom right, #a78bfa, #8b5cf6, #6d28d9)',
                  border:'white 1px solid'
            }}
            onClick={handleAddFeedback}
            className="bg-[#1b4332] text-white px-3 py-1 "
          >
            Submit
          </button>
        </div>




        {/* feedback show option */}
        {/* <ul className="list-disc list-inside mt-2 text-gray-700">
          {(blog.feedback || []).map((fb, i) => (
            <li key={i}>{fb}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default Blogdata;
