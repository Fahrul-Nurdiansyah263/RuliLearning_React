import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SkeletonTable from "../../common/SkeletonTable";
import IsiMateriCard from "../../common/IsiMateriCard";

export default function IsiMateri() {
  const navigate = useNavigate();
  const { kategoriId } = useParams();
  const [materiList, setMateriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [namaKategori, setNamaKategori] = useState("");

  useEffect(() => {
    const ambilSemuaMateri = async () => {
      setIsLoading(true);
      setError(null);
      setNamaKategori("");
      try {
        let query = supabase
          .from("isi_materi")
          .select(
            `id,judul,deskripsi,thumbnail,gambar,created_at, kategori_materi(judul)`
          )
          .order("created_at", { ascending: false });
        if (kategoriId) {
          query = query.eq("kategori_id", kategoriId);

          const { data: kategoriInfo, error: kategoriError } = await supabase
            .from("kategori_materi")
            .select(`judul`)
            .eq("id", kategoriId)
            .single();

          if (kategoriError) {
            console.warn("Gagal mengambil nama kategori:");
          } else if (kategoriInfo) {
            setNamaKategori(kategoriInfo.judul);
          }
        }
        const { data, error: fetchError } = await query;
        if (fetchError) throw fetchError;
        const dataWithPublicUrl = data.map((isiMateri) => {
          const { data: urlData } = supabase.storage
            .from("thumbnail_isi_materi")
            .getPublicUrl(isiMateri.thumbnail);

          return {
            ...isiMateri,
            publicUrl: urlData.publicUrl,
          };
        });
        setMateriList(dataWithPublicUrl || []);
      } catch (err) {
        setError("Gagal mengambil data materi.");
        toast.error("Gagal mengambil data materi.");

        console.error("Error fetching materi:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    ambilSemuaMateri();
  }, [kategoriId]);

  const handleDelete = async (id) => {

    console.log("ID diterima di handleDelete:", id);
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const deletePromise = supabase.from("isi_materi").delete().match({ id });

      await toast.promise(deletePromise, {
        loading: "Menghapus materi...",
        success: (response) => {
          if (response.error) {
            throw new Error(response.error.message);
          }
          setMateriList(materiList.filter((materi) => materi.id !== id));
          return "Materi berhasil dihapus!";
        },
        error: "Gagal menghapus materi",
      });
    }
  };

  {
    isLoading ? (
      <SkeletonTable rows={6} isAdmin={true} />
    ) : (
      <IsiMateriCard
        kategoriId={kategoriId}
        namaKategori={namaKategori}
        materiList={materiList}
        isAdmin={true}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/dashboard/edit-isi-materi/${id}`)}
        onNavigate={(id) => navigate(`/dashboard/isi-materi/${id}`)}
        onAdd={() => navigate("/dashboard/tambah-isi-materi")}
      />
    );
  }

  if (error) {
    {
      error && <p className="text-red-500 text-center mt-4">{error}</p>;
    }
  }

  return (
    <div className="p-8">
      <IsiMateriCard
        kategoriId={kategoriId}
        namaKategori={namaKategori}
        materiList={materiList}
        isAdmin={true}
        onDelete={ handleDelete}
        onEdit={(id) => navigate(`/dashboard/edit-isi-materi/${id}`)}
        onAdd={() => navigate("/dashboard/tambah-isi-materi")}
      />
    </div>
  );
}
