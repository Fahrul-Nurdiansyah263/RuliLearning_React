import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";

import { FaArrowLeft } from "react-icons/fa";
import InputField from "../../common/InputField";
import FileUploadPreview from "../../common/FileUploadPreview";
import SubmitButton from "../../common/SubmitButton";
import toast from "react-hot-toast";

export default function EditKategoriMateri() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [thumbnailFileBaru, setThumbnailFileBaru] = useState(null);
  const [thumbnailPreviewBaru, setThumbnailPreviewBaru] = useState(null);
  const [thumbnailPreviewLama, setThumbnailPreviewLama] = useState(null);
  const [kategoriLama, setKategoriLama] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchKategori() {
      if (!id) return;
      setIsLoadingData(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("kategori_materi")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (data) {
          setJudul(data.judul);
          setDeskripsi(data.deskripsi);
          setKategoriLama(data);
        }

        if (data.thumbnail) {
          const { data: publicUrlData } = supabase.storage
            .from("thumbnail_kategori_materi")
            .getPublicUrl(data.thumbnail);
          setThumbnailPreviewLama(publicUrlData.publicUrl);
        }
      } catch (err) {
        console.error("Error fetch kategori:", err.message);
        setError("Gagal memuat data kategori.");
        toast.error("Gagal memuat kategori");
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchKategori();
  }, [id]);

  useEffect(() => {
    if (!thumbnailFileBaru) {
      setThumbnailPreviewBaru(null);
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnailFileBaru);
    setThumbnailPreviewBaru(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFileBaru]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!judul || !deskripsi) {
      toast.error("Judul dan Deskripsi tidak boleh kosong.");
      return;
    }
    if (!kategoriLama) {
      toast.error("Data kategori lama tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let namaThumbnailFinal = kategoriLama.thumbnail;

      if (thumbnailFileBaru) {
        const fileExt = thumbnailFileBaru.name.split(".").pop();
        const namaThumbnailBaru = `thumbnail_kategori_materi/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("thumbnail_kategori_materi")
          .upload(namaThumbnailBaru, thumbnailFileBaru);

        if (uploadError) throw uploadError;
        namaThumbnailFinal = namaThumbnailBaru;

        if (kategoriLama.thumbnail) {
          await supabase.storage
            .from("thumbnail_kategori_materi")
            .remove([kategoriLama.thumbnail]);
        }
      }

      const { error: updateError } = await supabase
        .from("kategori_materi")
        .update({
          judul,
          deskripsi,
          thumbnail: namaThumbnailFinal,
          updated_at: new Date(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Kategori berhasil diperbarui");
      setTimeout(() => {
        navigate("/dashboard/kategori-materi");
      }, 1500);
    } catch (err) {
      console.error("Error update kategori:", err.message);
      setError("Gagal memperbarui kategori");
      toast.error("Gagal memperbarui kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <p className="p-8 text-center text-gray-700">Memuat data kategori...</p>
    );
  }

  {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
    <strong className="font-bold">Terjadi Kesalahan: </strong>
    <span className="block sm:inline">{error}</span>
  </div>
)}

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/kategori-materi")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-blue-600"
      >
        <FaArrowLeft />
        <span>Kembali Ke Daftar</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Edit Kategori:{" "}
        <span className="text-indigo-600">{kategoriLama?.judul}</span>
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-8"
      >
        <InputField
          label="Judul Kategori"
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan Judul Baru"
        />

        <div>
          <label
            htmlFor="deskripsi"
            className="block text-gray-700 font-semibold mb-2"
          >
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            rows="4"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan deskripsi kategori"
            required
          />
        </div>

        <FileUploadPreview
          label="Ganti Thumbnail (Opsional)"
          file={thumbnailFileBaru}
          setFile={setThumbnailFileBaru}
          preview={thumbnailPreviewBaru}
          previewLama={thumbnailPreviewLama
          }
          namaFileLama={kategoriLama?.thumbnail}
        />

        <div className="flex flex-col sm:flex-row justify-end  pt-2  sm:pt-4">
          <SubmitButton
            label="Simpan Perubahan"
            loadingLabel="Menyimpan..."
            isLoading={isSubmitting}
            disabled={isLoadingData}
          />
        </div>
      </form>
    </div>
  );
}
