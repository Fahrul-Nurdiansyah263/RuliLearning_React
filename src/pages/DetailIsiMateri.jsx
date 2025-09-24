import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import parse from "html-react-parser";
import SkeletonDetailMateri from "../components/common/SkeletonDetailMateri";

export default function DetailIsiMateri() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [materi, setMateri] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ambilDetailMateri = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from("isi_materi")
          .select(
            `
            id, judul, deskripsi, gambar, thumbnail, created_at, 
            kategori_materi(judul)
          `
          )
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          if (data.thumbnail) {
            const { data: thumb } = supabase.storage
              .from("thumbnail_isi_materi")
              .getPublicUrl(data.thumbnail);
            data.thumbnailUrl = thumb.publicUrl;
          }

          if (data.gambar) {
            const { data: img } = supabase.storage
              .from("gambar_isi_materi") 
              .getPublicUrl(data.gambar);
            data.gambarUrl = img.publicUrl;
          }

          setMateri(data);
        } else {
          setError("Materi tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal mengambil detail materi");
        console.error("Error fetching materi:", err.message);
      } finally {
        setLoading(false)
      }
    };

    if (id) ambilDetailMateri();
  }, [id]);

  if (loading) {
    return <SkeletonDetailMateri />; 
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!materi) {
    return <div className="p-8 text-center text-gray-500">Materi tidak dapat ditemukan.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow"
      >
        ← Kembali
      </button>

      <h1 className="text-3xl font-extrabold mb-4">{materi.judul}</h1>

      <span className="inline-block mb-6 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
        {materi.kategori_materi?.judul || "Tanpa Kategori"}
      </span>

      <div className="flex flex-col py-10 justify-center items-center">
        {materi.thumbnailUrl && (
          <img
            src={materi.thumbnailUrl}
            alt={`Thumbnail ${materi.judul}`}
            className=" object-cover rounded-xl shadow mb-6"
          />
        )}
      </div>

      <div className="prose max-w-none text-gray-700 mb-6 font-inter text-justify">
        {parse(materi.deskripsi || "Tidak ada deskripsi")}
      </div>

      <div className="flex flex-col py-10 justify-center items-center">
        {materi.gambarUrl && (
          <img
            src={materi.gambarUrl}
            alt={materi.judul}
            className=" object-contain rounded-xl shadow mb-6"
          />
        )}
        <p>
          Anda dapat memindai kode QR berikut untuk melihat {materi.judul} dalam
          tampilan 3D.
        </p>
      </div>
    </div>
  );
}
