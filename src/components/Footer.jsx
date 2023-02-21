import React from 'react';
import { AiFillHeart } from "react-icons/ai";

function Footer() {
  return (
    <footer className=" fixed inset-x-0 bottom-0 text-left pl-2.5 bg-white border-gray-200 rounded w-full py-1 shadow-lg items-center">
      <p className='flex items-center text-gray-600'>
        © Made with <i className='p-1'><AiFillHeart /></i>
        <a target={'_blank'} rel="noreferrer" href="https://www.linkedin.com/in/constantinoabba/">by Constantino Abba</a>
      </p>
    </footer>
  )
}

export default Footer
