'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

function AHeader() {
  const options = [
  {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },
    {
        id: 3,
        name: 'Pricing',
        path: '/dashboard/billing'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/dashboard/profile'
    },
  ];

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md px-6 md:px-16 lg:px-32">
      <Link href="/">
         <div className="flex items-center gap-2">
        {/* Medical-themed logo: A simple cross */}
        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <h1 className="text-lg font-bold md:text-2xl text-blue-700">MediAI</h1>
      </div>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-10">
        {options.map((item) => (
          <Link key={item.id} href={item.path} passHref>
            <span className="text-gray-600 hover:text-gray-900 hover:font-semibold transition-all cursor-pointer">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <UserButton />
    </header>
  );
}

export default AHeader;
