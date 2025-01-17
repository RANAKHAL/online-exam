"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // signIn("credentials",{
    //   email : userName,
    //   password : password,
    //   callbackUrl : '/'
    // })

    const result = await signIn("credentials", {
      email: userName,
      password: password,
      callbackUrl : '/Dashboard/subject'
      // redirect: false,
    });

    console.log("result =====>>>", result);

    if (result?.ok) {
      // Fetch the session to get the token
      const session = await getSession();
      console.log("Session data:", session);
    } else {
      console.error("Sign-in failed:", result?.error);
    }
    
    
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-[35%] flex flex-col gap-6"
      >
        <p className="font-semibold text-lg">Sign in</p>

        <input
          type="text"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoComplete="off"
        />
        <input
          type="password"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
      
        <Link href={'/forgetPassword'} className="text-xs text-[#122D9C] text-end">Recover Password?</Link>
        <button
          type="submit"
          className={`bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl`}
          
        >
          Sign in
        </button>
      </form>
      <div className="flex gap-3 items-center">
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
        <p>or Continue with</p>
        <div className="divider h-[1px] bg-[#E7E7E7] w-12"></div>
      </div>
      <div className="social-login flex gap-4">
        <div onClick={() => signIn("facebook", { callbackUrl: "/home" })} className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer">
          <Image width={20} height={20} alt="google" src={"/Vector.png"} />
        </div>
        <div
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="google" src={"/Logo Google.png"} />
        </div>
        <div onClick={() => signIn("twitter", { callbackUrl: "/home" })} className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer">
          <Image width={20} height={20} alt="google" src={"/Logo.png"} />
        </div>
        {/* <div
          onClick={() => signIn("github", { callbackUrl: "/home" })}
          className="login-item flex justify-center hover:shadow-lg items-center border p-2 shadow-md rounded-lg cursor-pointer"
        >
          <Image width={20} height={20} alt="google" src={"/github.png"} />
        </div> */}
      </div>
    </div>
  );
}
