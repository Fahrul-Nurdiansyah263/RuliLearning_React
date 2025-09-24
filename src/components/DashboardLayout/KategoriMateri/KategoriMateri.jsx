import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import KategoriCard from "../../common/KategoriCard";
import SkeletonCard from "../../common/SkeletonCard";
import Swal from "sweetalert2";
import toast from "react-hot-toast";


export default function KategoriMateri() {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ambilSemuaKategori();
  }, []);

  async function ambilSemuaKategori() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("kategori_materi")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const dataWithPublicUrl = data.map((kategori) => {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("thumbnail_kategori_materi")
          .getPublicUrl(kategori.thumbnail);
        return { ...kategori, publicUrl };
      });

      setKategoriList(dataWithPublicUrl);
    } catch (err) {
      setError("Gagal mengambil data kategori.");
      console.error("Error fetching categories:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (idKategori, thumbnailPath) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Kategori ini dan materi terkait mungkin akan terpengaruh.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const toastId = toast.loading("Menghapus kategori...");
      try {
        const { error: deleteError } = await supabase
          .from("kategori_materi")
          .delete()
          .eq("id", idKategori);

        if (deleteError) throw deleteError;

        if (thumbnailPath) {
          await supabase.storage
            .from("thumbnail_kategori_materi")
            .remove([thumbnailPath]);
        }

        setKategoriList((list) => list.filter((k) => k.id !== idKategori));
        toast.success("Kategori berhasil dihapus.", { id: toastId });
      } catch (err) {
        toast.error("Gagal menghapus kategori.", { id: toastId });
        console.error("Error deleting category:", err.message);
      }
    }
  };

  if (isLoading) {
    return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
    );
  }

  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen bg-gray-50 text-gray-800">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
          Daftar Kategori Materi
        </h1>
        <button
          onClick={() => navigate("/dashboard/tambah-kategori-materi")}
          className="text-xs sm:text-sm font-medium text-white bg-blue-600 px-4 py-2 sm:px-5 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 self-center sm:self-auto"
        >
          Tambah Kategori
        </button>
      </div>

      <hr className="my-5 border-gray-200" />

      {kategoriList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kategoriList.map((kategori) => (
            <KategoriCard
              key={kategori.id}
              kategori={kategori}
              isAdmin={true}
              onNavigate={() =>
                navigate(`/dashboard/isi-materi/kategori/${kategori.id}`)
              }
              onEdit={() =>
                navigate(`/dashboard/edit-kategori-materi/${kategori.id}`)
              }
              onDelete={() => handleDelete(kategori.id, kategori.thumbnail)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <p className="text-gray-500 text-sm sm:text-base">
            Belum ada kategori yang ditambahkan.
          </p>
        </div>
      )}
    </div>
  );
}
