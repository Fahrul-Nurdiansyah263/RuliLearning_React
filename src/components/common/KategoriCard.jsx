import React from "react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function KategoriCard({
  kategori,
  onNavigate,
  onEdit,
  onDelete,
  isAdmin = false,
}) {
  const publicUrl = kategori.publicUrl;

  return (
    <div
      onClick={onNavigate}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300 border border-gray-200 cursor-pointer group"
    >
      <div className="overflow-hidden">
        <img
          src={publicUrl}
          alt={`Thumbnail ${kategori.judul}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
          {kategori.judul}
        </h2>
        <p className="text-sm flex-grow text-gray-600 line-clamp-3">
          {kategori.deskripsi}
        </p>
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <button
              className="w-full text-sm font-medium py-2 px-3 rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center justify-center gap-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <FaPencilAlt /> Edit
            </button>
            <button
              className="w-full text-sm font-medium py-2 px-3 rounded-md bg-red-100 text-red-800 hover:bg-red-200 flex items-center justify-center gap-1 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <FaTrashAlt /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
