import React, { useEffect, useState } from "react";
import axios from "axios";
import { axiosConfig, ENDPOINT, handleLogout } from "../helper";
import Detail from "./Detail";

const Form = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [userRequest, setUserRequest] = useState<UserRequest>({} as UserRequest);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      getUserRequest(foundUser.username);
      getPackageData(foundUser.username);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId;

    const data = { deliveryAddress, contactNumber, contactPerson };
    await axios.post(
      `${ENDPOINT}/api/user-requests`,
      data, axiosConfig
    );
    window.location.reload();
  };

  const getUserRequest = async (username: string) => {
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId;

    const response = await axios.get<UserRequest>(
      `${ENDPOINT}/api/user-requests/user/${username}`,
      axiosConfig
    );
    setUserRequest(response.data);
  };

  const getPackageData = async (username: string) => {
    try {
      await axios.get<PackageData>(
        `https://us-central1-silicon-airlock-153323.cloudfunctions.net/rg-package-dummy?userId=${username}`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Invalid params or empty package (user not subscribed to any product packages)");
      }
    }
  };

  if (user?.username && Object.keys(userRequest).length > 0 && error === "") {
    console.log(error);
    return <Detail username={user?.username} />;
  }

  return (
    error !== "" ?
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="container sm:mt-24 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
        <div className="w-full">
          <p className="text-sm text-gray-500 ml-1">Welcome, {user?.username}</p>
          <button className="text-sm ml-1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="text-center my-6">
          <h1 className="text-3xl font-semibold text-gray-700">Form</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    </div>
    :
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="container sm:mt-24 mt-24 my-auto max-w-md border-2 border-gray-200 p-3 bg-white">
        <div className="w-full">
          <p className="text-sm text-gray-500 ml-1">Welcome, {user?.username}</p>
          <button className="text-sm ml-1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="text-center my-6">
          <h1 className="text-3xl font-semibold text-gray-700">Form</h1>
          <p className="text-gray-500">Input your personal detail to claim your prize</p>
        </div>
        <div className="m-6">
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="deliveryAddress" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Delivery Address</label>
              <textarea
                name="deliveryAddress"
                id="deliveryAddress"
                placeholder="Your delivery address"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={deliveryAddress}
                onChange={({ target }) => setDeliveryAddress(target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="contactNumber" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                placeholder="Your contact number"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={contactNumber}
                onChange={({ target }) => setContactNumber(target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="contactPerson" className="block mb-2 text-sm text-gray-600 dark:text-gray-400">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                id="contactPerson"
                placeholder="Your contact person"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                value={contactPerson}
                onChange={({ target }) => setContactPerson(target.value)}
              />
            </div>
            <div className="mb-6">
              <button type="submit" className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none duration-100 ease-in-out">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form;
