import React from 'react'
import { NavLink } from 'react-router-dom'
import { IoMdAddCircleOutline, IoIosLogOut } from 'react-icons/io'
import { MdFormatListBulletedAdd } from 'react-icons/md'
import { TbReservedLine } from "react-icons/tb";

const Sidebar = ({ setToken }) => {
  const handleLogout = () => {
    // Clear the token from state
    setToken("");
    // You could also add a toast notification here if desired
  }

  return (
    <div className='w-[20%] min-h-screen border-r-2 border-gray-200 bg-white'>
      <div className='mt-4 px-6'>
        <h2 className='text-[40px] text-center font-bold text-gray-800'>Mesob Restaurant</h2>
      </div>
      <div className='flex flex-col gap-4 pt-6'>
        <NavLink to='/add' className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-amber-600 hover:text-white'>
          <IoMdAddCircleOutline className='text-[35px] text-black' />
          <p className='hidden md:block text-base'>Add Product</p>
        </NavLink>

        <NavLink to='/list' className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-amber-600 hover:text-white'>
          <MdFormatListBulletedAdd className='text-[35px] text-black'/>
          <p className='hidden md:block text-base'>List Product</p>  
        </NavLink>

        <NavLink to='/table' className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-amber-600 hover:text-white'>
          <TbReservedLine className='text-[35px] text-black'/>
          <p className='hidden md:block text-base'>Reservations</p>        
        </NavLink>

        <button 
          onClick={handleLogout} 
          className='flex items-center gap-3 px-6 py-3 border-b-2 border-gray-200 text-gray-600 hover:bg-amber-600 hover:text-white w-full text-left'
        >
          <IoIosLogOut className='text-[35px] text-black' />
          <p className='hidden md:block text-base'>Logout</p>
        </button>
      </div>
    </div>
  )
}

export default Sidebar