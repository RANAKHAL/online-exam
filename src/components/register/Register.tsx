"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, username, email, password, rePassword } = formData;

    if (!firstName || !lastName || !username || !email || !password || !rePassword) {
      return "All fields are required.";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (password !== rePassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch("https://exam.elevateegy.com/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("data" ,data)

      if (!res.ok) {
        setError(data.message || "Failed to sign up. Please try again.");
        return;
      }

      setSuccess("Sign-up successful! Redirecting...");
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        rePassword: "",
        phone: "",
      });
      console.log("res" ,res)
      console.log("data" ,data)

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      <form
        onSubmit={handleSubmit}
        className="w-[35%] flex flex-col gap-6"
        autoComplete="off"
        aria-label="Registration Form"
      >
        <p className="font-semibold text-lg">Sign Up</p>

        <input
          type="text"
          name="firstName"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          aria-label="First Name"
          required
        />

        <input
          type="text"
          name="lastName"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          aria-label="Last Name"
          required
        />

        <input
          type="text"
          name="username"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          aria-label="Username"
          required
        />

        <input
          type="email"
          name="email"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          aria-label="Email"
          required
        />

        <input
          type="password"
          name="password"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          aria-label="Password"
          required
        />

        <input
          type="password"
          name="rePassword"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Confirm Password"
          value={formData.rePassword}
          onChange={handleChange}
          aria-label="Confirm Password"
          required
        />

        <input
          type="text"
          name="phone"
          className="w-full shadow-lg border-2 p-2 rounded-lg"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          aria-label="Phone Number"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <p className="text-sm text-center tracking-widest">
          Already have an account?{" "}
          <span className="text-[#4461F2]">
            <Link href="/login">Login</Link>
          </span>
        </p>

        <button
          type="submit"
          className="bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl"
          aria-label="Create Account"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}