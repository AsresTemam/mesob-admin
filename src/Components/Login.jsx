import React, { useState } from 'react'
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const OnSubmitHandler = async (e) => {
        try {
            e.preventDefault();

            const response = await axios.post(backendUrl + '/api/user/admin', {email, password});
            if (response.data.success) {
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
            
        }
        
    }
  return (
    <div>
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='bg-white px-8 py-6 rounded-lg shadow-md w-full max-w-md'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>Admin Login</h1>
                <form onSubmit={OnSubmitHandler}>
                    <div className='mb-4 '>
                        <p className='text-sm font-semibold text-gray-600 mb-2'>Email Address</p>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' required className='w-[95%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-800'/>
                    </div>
                    <div className='mb-4'>
                        <p className='text-sm font-semibold text-gray-600 mb-2'>Password</p>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' required className='w-[95%] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gray-800'/>
                    </div>
                    <button type='submit' className='w-full text-lg font-bold bg-amber-500 hover:bg-amber-400 py-2 px-3 rounded-md'>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login