import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { FaArrowLeft } from "react-icons/fa";
import QuillEditor from "../../common/QuillEditor";
import InputField from "../../common/InputField";
import SelectKategori from "../../common/SelectKategori";
import FileUploadPreview from "../../common/FileUploadPreview";
import SubmitButton from "../../common/SubmitButton";

export default function AddIsiMateri() {
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [gambar, setGambar] = useState(null);
  const [gambarPreview, setGambarPreview] = useState(null);
  const [deskripsi, setDeskripsi] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchKategori() {
      const { data, error } = await supabase
        .from("kategori_materi")
        .select("id, judul");

      if (!error && data) {
        setKategoriOptions(data);
      } else {
        toast.error("Gagal memuat kategori");
      }
    }
    fetchKategori();
  }, []);

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnail]);

  useEffect(() => {
    if (!gambar) {
      setGambarPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(gambar);
    setGambarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [gambar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !kategori || !deskripsi) {
      toast.error("Judul, Kategori, dan Deskripsi wajib diisi");
      return;
    }
    setIsLoading(true);

    const submissionPromise = (async () => {
      let thumbnailUrl = null;
      if (thumbnail) {
        const fileName = `thumbnail_isi_materi/${Date.now()}_${thumbnail.name}`;
        const { data, error } = await supabase.storage  
          .from("thumbnail_isi_materi")
          .upload(fileName, thumbnail);
        if (error) throw error;
        thumbnailUrl = data.path;
      }
      let gambarUrl = null;
      if (gambar) {
        const fileName = `gambar_isi_materi/${Date.now()}_${gambar.name}`;
        const { data, error } = await supabase.storage
          .from("gambar_isi_materi")
          .upload(fileName, gambar);
        if (error) throw error;
        gambarUrl = data.path;
      }
      const { error: inserError } = await supabase.from("isi_materi").insert([
        {
          judul,
          kategori_id: kategori,
          deskripsi,
          thumbnail: thumbnailUrl,
          gambar: gambarUrl,
        },
      ]);
      if (inserError) throw inserError;
      return "Materi baru berhasil ditambahkan";
    })();

    await toast.promise(submissionPromise, {
      loading: "Menambahkan materi...",
      success: (message) => {
        setTimeout(() => navigate("/dashboard/isi-materi"), 1500);
        return message;
      },
      error: (err) =>
        `Gagal menambahkan materi: ${err.message} || "Error tidak diketahui"`,
    });
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Tambah Isi Materi</h1>
      <button
              onClick={() => navigate("/dashboard/isi-materi")}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-blue-600"
            >
              <FaArrowLeft />
              <span>Kembali Ke Daftar</span>
            </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Judul"
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukan judul Materi"
        />

        <SelectKategori
          label="Kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          options={kategoriOptions}
        />

        <FileUploadPreview
          label="Thumbnail"
          file={thumbnail}
          setFile={setThumbnail}
          preview={thumbnailPreview}
        />

        <QuillEditor
          value={deskripsi}
          onChange={(v) => setDeskripsi(v)}
          placeholder="Tulis deskripsi materi di sini...."
        />

        <FileUploadPreview
          label="Gambar Utama"
          file={gambar}
          setFile={setGambar}
          preview={gambarPreview}
        />

        <div className="flex justify-end">
          <SubmitButton
            label="Simpan Materi"
            loadingLabel="Menyimpan..."
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
}