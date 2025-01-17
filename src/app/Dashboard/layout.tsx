'use client';

import Image from "next/image";
import { useRouter } from "next/navigation"; // Corrected import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faClock,
  faSignOutAlt,
  faFlag,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function Home({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Correctly defined handleLogout function
  const handleLogout = () => {
    // Perform any necessary logout logic here (e.g., clearing tokens, state, etc.)
    console.log("Logging out...");
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div>
      <div className="flex">
        {/* Sidebar */}
        <div className="bg-gray-100 w-64 h-screen p-4 flex flex-col shadow-md">
          {/* Logo */}
          <div className="flex items-center py-3 mb-6">
            <Image
              src="/Final Logo 1.png"
              alt="Profile"
              className="w-100 h-10 ml-4"
              width={150}
              height={50}
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <a
              href="#dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-500 px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon
                icon={faTableColumns}
                className="text-lg"
                style={{ width: "16px", height: "16px", color: "#4461F2" }}
              />
              <span
                className="text-lg font-lg"
                style={{
                  color: "#696F79",
                  fontWeight: "bold",
                  lineHeight: "60px",
                }}
              >
                Dashboard
              </span>
            </a>

            <a
              href="#quiz-history"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-500 px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon
                icon={faClock}
                className="text-blue-500 text-lg"
                style={{ width: "16px", height: "16px", color: "#4461F2" }}
              />
              <span
                className="text-lg font-lg"
                style={{
                  color: "#696F79",
                  fontWeight: "bold",
                  lineHeight: "60px",
                }}
              >
                Quiz History
              </span>
            </a>

            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 hover:bg-blue-500 px-4 py-2 rounded-lg"
              onClick={handleLogout} // Corrected onClick
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="text-blue-500 text-lg"
                style={{ width: "16px", height: "16px", color: "#4461F2" }}
              />
              <span
                className="text-lg font-lg"
                style={{
                  color: "#696F79",
                  fontWeight: "bold",
                  lineHeight: "60px",
                }}
              >
                Log Out
              </span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto p-6 h-screen">
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
                width={40}
                height={40}
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className="w-full bg shadow-md rounded-lg flex items-center p-4 my-5">
            {/* Profile Image */}
            <div className="flex-shrink-0 w-1/4 h-full">
              <div className="relative w-full h-full flex justify-center items-center">
                <Image
                  src="/Frame 40.png"
                  alt="Profile Picture"
                  className="rounded-lg object-cover"
                  style={{ width: "90%", height: "90%" }}
                  width={500}
                  height={500}
                  quality={100}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow ml-4">
              <h2 className="text-2xl font-bold text-blue-600">
                Ahmed Mohamed
              </h2>
              <p className="text-gray-500 mb-4">Voluptatem aut</p>

              {/* Progress Bar */}
              <div className="w-9/12 bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "70%" }} // Mock progress percentage
                ></div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3">
                {/* Quiz Passed */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg shadow-sm text-blue-600">
                    <FontAwesomeIcon
                      icon={faFlag}
                      className="text-blue-500 text-2xl"
                      style={{ color: "#4461F2" }}
                    />
                  </div>
                  <div className="flex flex-col px-4 justify-items-center">
                    <h1
                      className="text-2xl  font-bold"
                      style={{ color: "#696F79" }}
                    >
                      27
                    </h1>
                    <p className="text-gray-500 text-md">Quiz Passed</p>
                  </div>
                </div>
                {/* Fastest Time */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg shadow-sm text-blue-600">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-blue-500 text-2xl"
                      style={{ color: "#4461F2" }}
                    />
                  </div>
                  <div className="flex flex-col px-4 justify-items-center">
                    <h1
                      className="text-2xl  font-bold"
                      style={{ color: "#696F79" }}
                    >
                      13 min
                    </h1>
                    <p className="text-gray-500 text-md">Fastest Time</p>
                  </div>
                </div>

                {/* Correct Answers */}
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg shadow-sm text-blue-600">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-blue-500 text-2xl"
                      style={{ color: "#4461F2" }}
                    />
                  </div>
                  <div className="flex flex-col px-4 justify-items-center">
                    <h1
                      className="text-2xl  font-bold"
                      style={{ color: "#696F79" }}
                    >
                      200
                    </h1>
                    <p className="text-gray-500 text-md">Correct Answers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
