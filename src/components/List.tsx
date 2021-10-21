import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { axiosConfig, ENDPOINT, handleLogout } from "../helper";

import "../styles/list.css";

const List = () => {
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);

  useEffect(() => {
    getUserRequests();
  }, []);

  const getUserRequests = async () => {
    axiosConfig.headers["SESSION_ID"] = JSON.parse(localStorage.getItem('user') ?? '').sessionId
    const response = await axios.get<UserRequest[]>(
      `${ENDPOINT}/api/user-requests`,
      axiosConfig
    );
    setUserRequests(response.data);
  };

  return (
    <div className="container mx-auto py-10 flex justify-center h-screen">
      <div className="w-4/12 pl-4 h-full flex flex-col">
        <div className="w-full">
          <p className="text-sm text-gray-500 ml-1">Welcome, Admin.</p>
          <button className="text-sm ml-1" onClick={handleLogout}>Logout</button>
        </div>
        <div className="bg-white text-sm text-gray-500 font-bold px-5 py-2 shadow border-b border-gray-300 mt-2">
          User Requests
        </div>
        <div className="w-full h-full overflow-auto shadow bg-white" id="journal-scroll">
          <table className="w-full">
            <tbody className="">
              {userRequests.map((item) => {
                return (
                  <ListItem key={item.id} userRequest={item} />
                );
               })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ListItem = ({ userRequest }: { userRequest: UserRequest }) => {
  return (
    <tr className="relative transform scale-100 text-xs py-1 border-b-2 border-blue-100 cursor-default">
      <td className="pl-5 pr-3 whitespace-no-wrap">
        <div className="text-gray-400">{new Date(userRequest.created_at).toLocaleDateString("en")}</div>
      </td>
      <td className="px-2 py-2 whitespace-no-wrap">
        <div className="leading-10 text-gray-500 font-medium">{userRequest.contact_person}</div>
      </td>
      <td className="px-2 py-2 whitespace-no-wrap">
        <div className="leading-10 text-gray-500 font-medium">{userRequest.status.toUpperCase()}</div>
      </td>
      <td>
      <Link
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        to={`/requests/${userRequest.id}`}
      >Detail</Link>
      </td>
    </tr>
  )
}

export default List;
