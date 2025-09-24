import React from "react";
import parse from "html-react-parser";
import { supabase } from "../../services/supabaseClient";
import { FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";

export default function IsiMateriCard({
  kategoriId,
  namaKategori,
  materiList = [],
  isAdmin,
  onDelete = () => {},
  onEdit = () => {},
  onNavigate = () => {},
  onAdd = () => {},
}) {
  const getThumbnailUrl = (path) => {
    if (!path) return null;
    const { data } = supabase.storage
      .from("thumbnail_isi_materi")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          {kategoriId
            ? `Materi Kategori: ${namaKategori}`
            : "Daftar Semua Isi Materi"}
        </h1>
        {isAdmin && (
          <button
            onClick={() => onAdd()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md flex items-center gap-2 transition-all duration-200 w-full sm:w-auto"
          >
            <FaPlus className="text-sm" />
            Tambah Materi
          </button>
        )}
      </div>

      <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-sm text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Thumbnail</th>
                <th className="px-6 py-4 text-left">Judul Materi</th>
                <th className="px-6 py-4 text-left">Kategori</th>
                <th className="px-6 py-4 text-left">Deskripsi</th>
                {isAdmin && <th className="px-6 py-4 text-left">Tanggal Dibuat</th>}
                {isAdmin && <th className="px-6 py-4 text-left">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materiList.length > 0 ? (
                materiList.map((materi, index) => {
                  const thumbnailUrl = getThumbnailUrl(materi.thumbnail);
                  return (
                    <tr
                      key={materi.id}
                      id={materi.id}
                      className={`cursor-pointer transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                      onClick={() => onNavigate(materi.id)}
                    >
                      <td className="px-6 py-4">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={materi.judul}
                            className="w-20 h-20 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Tidak ada gambar
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold">{materi.judul}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {materi.kategori_materi?.judul || "Tidak ada kategori"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="prose max-w-none text-sm line-clamp-5">
                          {parse(materi.deskripsi || "Tidak ada deskripsi")}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-gray-700">
                          {new Date(materi.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                      )}
                      {isAdmin && (
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(materi.id);
                            }}
                          >
                            <FaPencilAlt />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(materi.id);
                            }}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="text-center py-10 text-gray-500"
                  >
                    Tidak ada materi yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {materiList.length > 0 ? (
          materiList.map((materi) => {
            const thumbnailUrl = getThumbnailUrl(materi.thumbnail);
            return (
              <div
                key={materi.id}
                onClick={() => onNavigate(materi.id)}
                className="bg-white rounded-xl shadow p-4 space-y-2 border hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-3">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={materi.judul}
                      className="w-16 h-16 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-sm">
                      No Img
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-gray-800">{materi.judul}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {materi.kategori_materi?.judul || "Tidak ada kategori"}
                    </span>
                  </div>
                </div>

                <div className="text-gray-700 text-sm line-clamp-3">
                  {parse(materi.deskripsi || "Tidak ada deskripsi")}
                </div>

                {isAdmin && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(materi.created_at).toLocaleDateString("id-ID")}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(materi.id);
                        }}
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(materi.id);
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            Tidak ada materi yang ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
