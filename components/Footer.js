import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='bg-slate-950 text-white flex p-4 h-16 justify-center items-center'>
        <p>Copyright &copy; {year} Buy me A-Coffee </p>
    </footer>
  )
}

export default Footer
