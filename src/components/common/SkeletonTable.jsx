import React from "react";

export default function SkeletonTable({ rows = 5, isAdmin = false }) {
  

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 animate-pulse">
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
          {Array.from({ length: rows }).map((_, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-6 py-4">
                <div className="w-20 h-20 bg-gray-300 rounded-lg" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-32 bg-gray-300 rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-300 rounded-full" />
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-64 bg-gray-300 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
              </td>
              {isAdmin && (
                <td className="px-6 py-4">
                  <div className="h-4 w-28 bg-gray-300 rounded" />
                </td>
              )}
              {isAdmin && (
                <td className="px-6 py-4 flex gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg" />
                  <div className="w-8 h-8 bg-gray-300 rounded-lg" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
