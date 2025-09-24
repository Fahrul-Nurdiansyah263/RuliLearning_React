import React from "react";
import { useOutletContext } from "react-router-dom";

export default function HomeDashboard() {
  const { userEmail } = useOutletContext();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Selamat Datang 
      </h1>
      <p className="mt-2 text-gray-600">
        Anda login sebagai{" "}
        <span className="font-medium text-blue-600">{userEmail}</span>.
      </p>

      <hr className="my-6" />

      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md">
        <p className="font-bold">Panel Admin</p>
        <p>Gunakan menu di sebelah kiri untuk mengelola konten website Anda.</p>
      </div>
    </div>
  );
}
