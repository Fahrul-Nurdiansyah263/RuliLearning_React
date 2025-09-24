import React, { useState } from "react";
import { supabase } from "./services/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid login credentials") {
        setMessage("Email atau password yang Anda masukan salah. Silahkan coba lagi")
      } else {
        setMessage("Terjadi kesalahan saat mencoba login")
        console.error("Login Error:", error.message)
      } 
      }finally {
        setLoading(false)
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Registrasi berhasil! Cek email untuk verifikasi");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {isLogin
            ? "Masuk untuk melanjutkan"
            : "Isi form di bawah ini untuk mendaftar"}
        </p>
        <form
          className="space-y-4"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span>Loading....</span>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center font-medium text-red-500">{message}</p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? "Register" : "Login"}
          </a>
        </p>
      </div>
    </div>
  );
}
