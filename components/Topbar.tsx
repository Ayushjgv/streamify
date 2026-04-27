"use client";
import React,{useState,useEffect} from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Topbar = () => {
  const [Input, setInput] = useState<string>('');
  return (
    <div className='flex gap-4 items-center bg-black p-2 justify-between'>
      {/* left   */}
      <div className='flex gap-4 items-center bg-black p-2'>
        <MenuIcon className='text-white'></MenuIcon>
        <h1 className='text-2xl font-bold text-white'>Streamify</h1>
        <input 
          type="text" 
          placeholder="Search..." 
          className='bg-gray-800 text-white placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-3xl p-2 ml-2 pl-2 w-lg' 
          value={Input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>


      {/* right  */}

      <div className='flex gap-4 items-center bg-black p-2 text-white'>
        <button className='cursor-pointer'>Login/Signup</button>
        <img src="https://static.vecteezy.com/system/resources/previews/006/732/119/non_2x/account-icon-sign-symbol-logo-design-free-vector.jpg" alt="User" className='rounded-full w-8' />
      </div>

    </div>
  )
}

export default Topbar
