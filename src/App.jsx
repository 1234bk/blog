import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";
import { useContext } from "react";
import Signin from "./first/signin";
import Signup from './first/signup'
import Home from './pages/home'
import Add from './pages/add'
import Account from "./pages/account";
import Profile from "./pages/profile";  
import Nav from "./navbar/nav";
import Layout from "./layout";
import { FirebaseContext } from "./firecontext";
import Blogdata from "./pages/blogdata";
import Feedback from "./pages/feedback";
import Myblog from "./pages/myblog";

function App() {
  const fb = useContext(FirebaseContext);
  console.log(fb.user)
  if(!fb.user) {
    return (
      <Routes>
        
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    )
  }
 

  return (
    
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={< Home/>} />
        <Route path="add" element={< Add/>} />
        <Route path="account" element={< Account/>} />
        <Route path="myblog" element={< Myblog/>} />
        <Route path="feedback" element={< Feedback/>} />
        <Route path="profile" element={< Profile/>} />
        <Route path="/home/:id" element={< Blogdata/>} />
        
        
      </Route>
    </Routes>
  )
}

export default App
