import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  Lock, LogOut, ShoppingCart } from "lucide-react"
import { MyContext } from '../App'

function NavBar({cart, setCart}) {

  const nav = useNavigate()

  const context = useContext(MyContext)

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    context.setIsAdmin(false)
    
    nav('/se_connecter_admin'); // Redirect to login or home page
  };
  

  return (
    <header className="fixed top-0 left-0 w-full bg-white backdrop-blur-md shadow-md z-50
    transition-all duration-300">
        <div className="container mx-auto px-4 py-2">
            <div className='flex flex-wrap justify-between items-center'>
            <nav className='flex flex-wrap items-center gap-4'>
              {context.isAdmin && <>
              <div className='hidden md:flex items-center justify-center md:gap-2'>
              <button className="w-fit flex flex-row gap-1 justify-center items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogout}>
                  <LogOut size={18}/>
                  <p className=''>déconnecter</p>
              </button>
                <Link to='/dashboard/commandes'
                   className="w-fit flex flex-row gap-1 justify-center items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">
                <Lock />
              </Link>
                </div>
                <div className='flex items-center justify-center md:hidden gap-2'>
              <button className="w-fit flex flex-row gap-1 justify-center items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
              onClick={handleLogout}>
                  <LogOut />
              </button>
                <Link to='/dashboard/commandes'
                   className="w-fit flex flex-row gap-1 justify-center items-center bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline">
                <Lock />
              </Link>
                </div>
                </>
              }
              <Link to="/panier" className='relative group'>
                <ShoppingCart className='inline-block mr-1 group-hover:text-red-500' size={20}/>
                <span className='absolute -top-3 left-3 bg-red-500 font-medium rounded-full px-2 py-0.5
                text-xs group-hover:bg-red-500 transition duration-300 ease-in-out text-white'>{cart.length}</span>
              </Link>
              <Link to="/produits" className='text-gray-800 font-medium hover:text-red-500 transition duration-300 ease-in-out'>المنتجات</Link>
              {context?.isAdmin ?
              <div className="hidden md:inline">
              <Link to="/" className='text-gray-800 font-medium hover:text-red-500 transition duration-300 ease-in-out'>الصفحة الرئيسية</Link>
              </div>
              :
              <Link to="/" className='text-gray-800 font-medium hover:text-red-500 transition duration-300 ease-in-out'>الصفحة الرئيسية</Link>
              }
            </nav>
            <Link to="/" className='text-xl font-bold text-gray-800 items-center space-x-2 flex hover:opacity-85'>
                <img className='w-10 h-10 object-cover' src="/yokai.png" alt="Art Tshirt" srcset="" />
            </Link>
            </div>
        </div>
    </header>
  )
}

export default NavBar