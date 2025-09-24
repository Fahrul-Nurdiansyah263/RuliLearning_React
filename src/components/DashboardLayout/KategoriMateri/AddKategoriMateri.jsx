import React, { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

import InputField from "../../common/InputField";
import FileUploadPreview from "../../common/FileUploadPreview";
import SubmitButton from "../../common/SubmitButton";

export default function AddKategoriMateri() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
 

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnail]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!judul || !deskripsi || !thumbnail) {
      toast.error("Harap isi semua kolom (judul, deskripsi, dan thumbnail).");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const fileExtension = thumbnail.name.split(".").pop();
      const namaFile = `thumbnail_kategori_materi/${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnail_kategori_materi")
        .upload(namaFile, thumbnail);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("kategori_materi")
        .insert([{ judul, deskripsi, thumbnail: namaFile }]);

      if (insertError) throw insertError;

      navigate("/dashboard/kategori-materi");
    } catch (err) {
      toast.error("Gagal membuat kategori baru. Silahkan coba lagi.");
      console.error("Error creating kategori_materi:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard/kategori-materi")}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center"
        >
          <div className="flex gap-2  justify-center items-center">
            <FaArrowLeft /> Kembali ke Daftar Kategori Materi
          </div>
        </button>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Tambah Kategori Materi
          </h2>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              <div className="space-y-6">
                <InputField
                  label="Judul"
                  id="judul"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul Kategori Materi"
                />
                <div>
                  <label
                    htmlFor="deskripsi"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Deskripsi Singkat
                  </label>
                  <textarea
                    id="deskripsi"
                    rows="4"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    disabled={isSubmitting}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <FileUploadPreview
                label="Thumbnail"
                file={thumbnail}
                setFile={setThumbnail}
                preview={thumbnailPreview}
              />
            </div>
            <div className="flex justify-end">
              <SubmitButton
                label="Simpan Materi"
                loadingLabel="Menyimpan..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
