"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function resetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
  });
    const [error, setError] = useState("");

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://exam.elevateegy.com/api/v1/auth/resetPassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to sign up");
        return;
      }

      setSuccess("Sign-up successful! Redirecting...");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full p-4">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="font-semibold text-lg text-start">Set a Password</h1>

    <input
          type="email"
          name="email"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="newPassword"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder=" New Password"
          value={formData.newPassword}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <button
          type="submit"
          className={`bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl`}
          
        >
          Sign in
        </button>
      </form>

      <div className="flex gap-3 items-center w-full max-w-md">
        <div className="divider h-[1px] bg-[#E7E7E7] flex-grow"></div>
        <p className="text-sm text-gray-600">Or continue with</p>
        <div className="divider h-[1px] bg-[#E7E7E7] flex-grow"></div>
      </div>

      <div className="social-login flex gap-4 justify-center">
        {[
          { src: "/Vector.png", alt: "Provider 1" },
          { src: "/Logo Google.png", alt: "Google", action: () => signIn("google", { callbackUrl: "/home" }) },
          { src: "/Logo.png", alt: "Provider 2" },
          { src: "/github.png", alt: "GitHub", action: () => signIn("github", { callbackUrl: "/home" }) },
        ].map(({ src, alt, action }, index) => (
          <div
            key={index}
            onClick={action}
            className={`login-item flex justify-center items-center border p-2 shadow-md rounded-lg cursor-pointer hover:shadow-lg ${
              action ? "hover:bg-gray-100" : ""
            }`}
            aria-label={`Login with ${alt}`}

          >
            <Image width={20} height={20} src={src} alt={alt} />
          </div>
        ))}
      </div>
    </div>
  );
}
