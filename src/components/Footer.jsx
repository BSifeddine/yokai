import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram } from "lucide-react"

function Footer() {
  return (
    <header className="w-ful bg-opacity-90 backdrop-blur-md bg-white shadow-lg z-40
    transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
            <div className='flex flex-wrap justify-between items-center'>
            <nav className='flex flex-wrap items-center gap-4'>
              <Link to="https://www.instagram.com/art_tshirt_dz/" className='relative group' target='_blank'>
                <Instagram className='inline-block mr-1 group-hover:text-orange-600 text-gray-800' size={20}/>
              </Link>
              <Link to="https://www.facebook.com/profile.php?id=100089084718409" className='relative group'>
                <Facebook className='inline-block mr-1 group-hover:text-orange-600 text-gray-800' size={20}/>
              </Link>
            </nav>
            <div className='flex gap-1'>
            <p className='text-lg text-gray-800 items-center space-x-2 flex'>
                Art Tshirt
            </p>
            <p className='text-lg text-gray-800 items-center space-x-2 flex'>
                كل الحقوق محفوظة ل 
            </p>
            </div>
            </div>
        </div>
    </header>
  )
}

export default Footer