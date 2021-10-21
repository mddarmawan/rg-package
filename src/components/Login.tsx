import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosConfig, ENDPOINT } from "../helper";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = { username, password };
      const response = await axios.post(
        `${ENDPOINT}/api/sessions`,
        user, axiosConfig
      );
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert('Wrong credentials.');
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="container sm:mt-24 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
        <img className="float-right" alt="" src="https://www.ruangguru.com/hubfs/OPTIMIZE/logo%20rg.svg" />
        <div className="text-center my-6 mt-10">
          <h1 className="text-3xl font-semibold text-gray-700">Sign in</h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>
        <div className="m-6">
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Your username"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400">Password</label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Your password"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <div className="mb-6">
              <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
