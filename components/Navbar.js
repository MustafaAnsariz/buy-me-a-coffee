"use client"
import React, {useState} from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import Github from 'next-auth/providers/github'

const Navbar = () => {

  const { data: session } = useSession()
  const [dropdown, setDropdown] = useState(false)

  const handleBlur = () => {
    setTimeout(() => setDropdown(false), 100);
  };

  return (
    <nav className='bg-slate-950 text-white flex items-center justify-between p-4 h-16'>
        <div > <Link className='flex gap-1 items-center' href={'/'}>  <span> <img src="coffee-drink.gif" width={34} alt=""  /> </span> <span className='font-bold mt-2'> Buy Me a Coffee </span> </Link> </div>

    
      <div className='relative flex items-center justify-center'>
        {session && <>
<button onClick={() => setDropdown(!dropdown)} onBlur={handleBlur} id="dropdownInformationButton" data-dropdown-toggle="dropdownInformation" className="h-[45px] text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg font-medium text-sm px-4 mx-4 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 " type="button"> Welcome {session.user.name.replace(/[^a-zA-Z]/g, "")} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
</svg>
</button>

<div
  id="dropdownInformation"
  onMouseDown={e => e.preventDefault()}
  className={`z-10 ${dropdown ? "" : "hidden"} absolute left-[25px] md:left-[1px] top-[65px] w-[178px] bg-white divide-y divide-gray-100 rounded-lg shadow-sm md:w-60 dark:bg-gray-700 dark:divide-gray-600`}
>
    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
      <div className='font-bold'> User - {session.user.name.replace(/[^a-zA-Z]/g, "")} </div>           
      <div className="font-medium truncate break-words "> {session.user.email} </div>
    </div>
    <ul className="py-2 m-2 px-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownInformationButton">
      <Link href="/dashboard" className=""> <li className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
      Dashboard
      </li></Link>
      <Link href={`/${session.user.name}`} > <li className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>
      Your Profile
      </li></Link>
    </ul>
    <div className="py-2">
      <a
        onMouseDown={() => signOut()}
        href="#"
        className="block px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        Sign out
      </a>
    </div>
</div>
</>}
    
       {session &&  <button  onClick={() => signOut({ callbackUrl: "/" })} type="button" className=" md:block hidden mt-2 h-[45px] text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" >Sign out</button>}
       {!session &&  <Link href= {"/login"} > 
       <button  type="button" className="text-white bg-gradient-to-br mt-2 h-[45px] from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" >Login</button> </Link>}
      </div>
    </nav>
  )
}

export default Navbar
