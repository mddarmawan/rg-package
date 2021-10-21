import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { axiosConfig, ENDPOINT, handleLogout } from "../helper";

const prizes = {
  englishacademy: "Shoes",
  skillacademy: "Bag",
  ruangguru: "Pencils",
};

const Detail = ({ username }: { username?: string }) => {
  const [userRequest, setUserRequest] = useState<UserRequest>({} as UserRequest);
  const [packageData, setPackageData] = useState<PackageData>({} as PackageData);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }

    setLoading(true);
    getUserRequest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserRequest = async () => {
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId;

    if (username) {
      const response = await axios.get<UserRequest>(
        `${ENDPOINT}/api/user-requests/user/${username}`,
        axiosConfig
      );
      setUserRequest(response.data);
      getPackageData(username);
    } else {
      const response = await axios.get<UserRequest>(
        `${ENDPOINT}/api/user-requests/${id}`,
        axiosConfig
      );
      setUserRequest(response.data);
      getPackageByUser(response.data.user_id);
    }
  };

  const getPackageByUser = async (userId: string) => {
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId;

    const response = await axios.get<User>(
      `${ENDPOINT}/api/users/${userId}`,
      axiosConfig
    );
    getPackageData(response.data.username);
  };

  const getPackageData = async (username: string) => {
    const response = await axios.get<PackageData>(
      `https://us-central1-silicon-airlock-153323.cloudfunctions.net/rg-package-dummy?userId=${username}`
    );
    setPackageData(response.data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId;

    await axios.patch(
      `${ENDPOINT}/api/user-requests/${id}`,
      { status }, axiosConfig
    );
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 p-10">
      <div className="max-w-4xl  bg-white w-full rounded-lg shadow-xl">
        <div className="p-4 border-b">
          <h2 className="text-2xl ">
            User Request Information
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Personal and package details.
          </p>

          {username ? <button className="text-sm ml-1" onClick={handleLogout}>Logout</button> :
            <Link
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full"
              to={`/requests`}
            >Back</Link>
          }

        </div>
        <div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Full name</p>
            <p>{loading ? 'Loading...' : packageData?.user?.userName}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Username</p>
            <p>{loading ? 'Loading...' : packageData?.user?.userId}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Email Address</p>
            <p>{loading ? 'Loading...' : packageData?.user?.userEmail}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Phone Number</p>
            <p>{loading ? 'Loading...' : packageData?.user?.userPhoneNumber}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Delivery Address</p>
            <p>{loading ? 'Loading...' : userRequest?.delivery_address}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Contact Person</p>
            <p>{loading ? 'Loading...' : userRequest?.contact_person}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Contact Phone Number</p>
            <p>{loading ? 'Loading...' : userRequest?.contact_number}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Current Status</p>
            <p>{loading ? 'Loading...' : userRequest?.status?.toUpperCase()}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Packages</p>

            <div className="">
              {loading ? 'Loading...' : (
                packageData?.packages?.map((item) => {
                  return <PackageItemComponent key={item.packageSerial} item={item} />
                })
              )}
            </div>
          </div>

          {(userRequest?.status === 'created' && user?.role === 'admin')&&
            <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4">
              <p className="text-gray-600">
                Status
              </p>
              <div className="space-y-2">
                <div className="flex items-center p-2 rounded justify-between space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => handleStatusChange(userRequest.id, 'accepted')}
                  >Accept</button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => handleStatusChange(userRequest.id, 'rejected')}
                  >Reject</button>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  )
}

const PackageItemComponent = ({ item }: { item: PackageItem }) => {
  return (
    <div className="max-w-md py-5 px-8 bg-white shadow-lg rounded-lg my-20 mb-5 mt-2">
      <div className="flex justify-center md:justify-end"></div>
      <div>
        <h2 className="text-gray-800 text-lg font-semibold">{item.packageName}</h2>
        <p className="text-sm text-gray-600">{item.packageTag.toUpperCase()} - {item.packageSerial}</p>
        <p className="text-sm text-green-600">{item.orderStatus}</p>
        <p className="text-md text-gray-600 mt-2">Eligible Prize: {prizes[item.packageTag]}</p>
      </div>
    </div>
  );
}

export default Detail;
