"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({ email: "" });
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
    setLoading(true);

    try {
      const res = await fetch("https://exam.elevateegy.com/api/v1/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to recover password.");
        setLoading(false);
        return;
      }

      setSuccess("Password recovery email sent! Check your inbox.");
      setTimeout(() => {
        router.push("/verifyCode");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full p-4">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="font-semibold text-lg text-start">Forgot Your Password?</h1>

        <input
          type="email"
          name="email"
          className="w-full shadow-lg border-2 p-3 rounded-lg"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          aria-label="Email Address"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#4461F2] text-white font-medium text-sm w-full p-3 rounded-2xl transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3550D6]"
          }`}
        >
          {loading ? "Sending Email..." : "Send Recovery Email"}
        </button>

        <p className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-[#4461F2] hover:underline">
            Login
          </Link>
        </p>
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
