import React from 'react'
import { Outlet } from "react-router-dom";
import Nav from "./navbar/nav";

const Layout = () => {
  return (
    <>
      <Nav />
      {/* <div className='w-full h-full'> */}
      <Outlet />
    </>
  )
}

export default Layout
