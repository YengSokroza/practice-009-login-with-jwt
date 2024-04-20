'use client'
import { error, log } from 'console';
import React, { useState } from 'react'
import { date } from 'yup';


export default function TestJwt() {
    const [accessToken, setAccessToken] = useState("");
    const [user,setUser] = useState("null");
    const [unAuthorized,setUnAuthorized ] = useState(false);


    const handleLogin = async () => {
        const email = "yengsokroza2023@gmail.com";
        const password= "roza1234"

        fetch(process.env.NEXT_PUBLIC_API_URL + '/login',
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email , password}),
        }).then(res => res.json()).then(data => {
                console.log("Data in jwt test: ", data);
                setAccessToken(data.accessToken);
                setUser(data.user);
                
            }).catch(error => {
                console.log(error);
                
            })

    }


    //handle patial update
    const handlePartialUpdate = async () => {
        const body = {
            name: "typescript lesson update"
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/products/${530}`,
        {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,

            },
            body: JSON.stringify(body),
            
        })

        if(res.status === 401){
            setUnAuthorized(true);
        }

        const data = await res.json();
        console.log("Data from partial update: " , data);
        
    }


    //handle refresh token
    const handleRefreshToken = async () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/refresh',
        {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({}),

        }).then(res => res.json()).then(data => {
            console.log("Data from refresh token: ", data);
            
        }).catch(error => {
            console.log(error);
            if(error.status === 401){
                setUnAuthorized(true);
            }
            
        })

    }

  return (
    <main className='h-screen grid place-content-center'>
        <h1 className='text-4xl text-center'>Test Handle Login</h1>
        <button onClick={handleLogin} className='my-4 p-4 bg-blue-600 rounded-xl text-white text-lg '>Login</button>

        
        <button onClick={handlePartialUpdate} className='my-4 p-4 bg-blue-600 rounded-xl text-white text-lg '>Partial Update</button>

        
       

        {unAuthorized && (
             <button onClick={handleRefreshToken} className='my-4 p-4 bg-blue-600 rounded-xl text-white text-lg '>Refresh</button>
        )}

    </main>
  )
}
