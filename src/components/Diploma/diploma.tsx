"use client";
import LoginForm from "@/components/login/Login";
import Quizes from "@/components/Quizes/quizes";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default async function Diploma() {
 
  return (
    <div className="flex">
          {/* Sidebar */}
          <div className="bg-gray-100 w-64 p-4 flex flex-col shadow-md h-screen">
            {/* Logo */}
            <div className="flex items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-500">ELEVATE</h1>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              <a
                href="#dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                <i className="fas fa-home text-blue-500"></i>
                <span className="font-medium">Dashboard</span>
              </a>
              <a
                href="#quiz-history"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                <i className="fas fa-clock text-gray-500"></i>
                <span className="font-medium">Quiz History</span>
              </a>
              <button
               // Replace with your logout function
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                <i className="fas fa-sign-out-alt text-gray-500"></i>
                <span className="font-medium">Log Out</span>
              </button>
            </nav>
          </div>


          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
  <div className="flex-grow">
    <input
      type="text"
      placeholder="Search Quiz"
      className="border rounded-lg py-2 px-4 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  <div className="flex items-center ml-4">
    <button className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold">
      Start Quiz
    </button>
    <Image
      src="/bro.png"
      alt="Profile"
      className="w-10 h-10 rounded-full ml-4"
      width={308}
      height={308}
    />
  </div>
</div>


            {/* Profile Section */}
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
              <Image
                src="/bro.png"
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-blue-500"
                width={308}
                height={308}
              />
              <div className="ml-6">
                <h2 className="text-2xl font-semibold text-gray-800">Ahmed Mohamed</h2>
                <p className="text-gray-500">Voluptatem aut</p>
                <div className="flex items-center mt-4">
                  <div className="flex items-center mr-6">
                    <div className="text-blue-500">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <span className="ml-2 text-gray-600 font-medium">27 Quizzes Passed</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <div className="text-blue-500">
                      <i className="fas fa-clock"></i>
                    </div>
                    <span className="ml-2 text-gray-600 font-medium">13 min Fastest Time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-blue-500">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <span className="ml-2 text-gray-600 font-medium">200 Correct Answers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quizzes Section */}
           <Quizes/>
          </div>
        </div>
  );
}
