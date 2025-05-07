import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Utility function to get styles
  const getNavLinkStyles = (isActive) => ({
    textDecoration: 'none',
    color: isActive ? 'white' : '#b7e4c7', // Active text is white, inactive is #b7e4c7
    transition: 'color 0.3s ease', 
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer',
  });

  return (
    <>
      <div style={{ zIndex: 10 }} className="relative">
        
        <div className="flex items-center justify-between bg-[#1b4332] text-white px-6 py-2 shadow-md border-b border-white">
          <NavLink
            style={({ isActive }) => getNavLinkStyles(isActive)}
            to="/home"
            className="text-white text-3xl font-bold hover:text-gray-300 no-underline"
          >
            MySite
          </NavLink>

          {/* Desktop NavLinks */}
          <div className="text-[#74c69d] mt-1 text-[1.3rem] hidden md:flex gap-10">
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} className="hover:!text-[#fff]" to="/home">Home</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} className="hover:!text-[#fff]" to="/add">Add Blog</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} className="hover:!text-[#fff]" to="/account">My Account</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} className="hover:!text-[#fff]" to="/profile">My Profile</NavLink>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden text-3xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden cursor-pointer flex flex-col bg-[#2d6a4f] text-[#d8f3dc] w-full left-0 transition duration-300 ease-in-out"> 
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} to="/home" className="px-6 py-3 hover:bg-[#52b788] hover:!text-[#081c15]">Home</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} to="/add" className="px-6 py-3 hover:bg-[#52b788] hover:!text-[#081c15]">Add Blog</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} to="/account" className="px-6 py-3 hover:bg-[#52b788] hover:!text-[#081c15]">My Account</NavLink>
            <NavLink style={({ isActive }) => getNavLinkStyles(isActive)} to="/profile" className="px-6 py-3 hover:bg-[#52b788] hover:!text-[#081c15]">My Profile</NavLink>
          </div>
        )}
      </div>
    </>
  );
}
