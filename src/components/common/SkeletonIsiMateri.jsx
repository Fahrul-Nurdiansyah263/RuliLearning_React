
import React from "react";

const SkeletonRow = ({ isAdmin }) => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="w-20 h-20 bg-gray-300 rounded-lg"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-28 bg-gray-300 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </td>
    {isAdmin && (
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
    )}
    {isAdmin && (
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </td>
    )}
  </tr>
);

export default function SkeletonIsiMateri({ isAdmin = false }) {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-9 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        {isAdmin && <div className="h-10 w-40 bg-gray-300 rounded-xl animate-pulse"></div>}
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="px-6 py-4">Thumbnail</th>
              <th className="px-6 py-4">Judul Materi</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Deskripsi</th>
              {isAdmin && <th className="px-6 py-4">Tanggal Dibuat</th>}
              {isAdmin && <th className="px-6 py-4">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <SkeletonRow key={i} isAdmin={isAdmin} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}