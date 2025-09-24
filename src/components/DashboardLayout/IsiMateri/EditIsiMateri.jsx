import React, { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import QuillEditor from "../../common/QuillEditor";
import InputField from "../../common/InputField";
import SelectKategori from "../../common/SelectKategori";
import FileUploadPreview from "../../common/FileUploadPreview";
import SubmitButton from "../../common/SubmitButton";
import toast from "react-hot-toast";

export default function EditIsiMateri() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [materiLama, setMateriLama] = useState(null);
  const [gambarFileBaru, setGambarFileBaru] = useState(null);
  const [thumbnailFileBaru, setThumbnailFileBaru] = useState(null);
  const [gambarPreviewBaru, setGambarPreviewBaru] = useState(null);
  const [thumbnailPreviewBaru, setThumbnailPreviewBaru] = useState(null);
  const [gambarPreviewLama, setGambarPreviewLama] = useState(null);
  const [thumbnailPreviewLama, setThumbnailPreviewLama] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchKategori() {
      const { data, error } = await supabase
        .from("kategori_materi")
        .select("id, judul");
      if (!error) setKategoriList(data);
    }
    fetchKategori();
  }, []);

  useEffect(() => {
    async function fetchMateri() {
      if (!id) return;
      setIsLoadingData(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("isi_materi")
          .select("*")
          .eq("id", id)
          .single();
        if (fetchError) throw fetchError;

        if (data) {
          setJudul(data.judul);
          setDeskripsi(data.deskripsi);
          setKategoriId(data.kategori_id);
          setMateriLama(data);

          if (data.thumbnail) {
            const { data: publicUrlData } = supabase.storage
              .from("thumbnail_isi_materi")
              .getPublicUrl(data.thumbnail);
            setThumbnailPreviewLama(publicUrlData.publicUrl);
          }

          if (data.gambar) {
            const { data: publicUrlData } = supabase.storage
              .from("gambar_isi_materi")
              .getPublicUrl(data.gambar);
            setGambarPreviewLama(publicUrlData.publicUrl);
          }
        }
      } catch (err) {
        setError("Gagal mengambil data materi yang akan di edit.");
        toast.error("Gagal mengambil data Isi Materi");
        console.error("Gagal mengambil data Isi Materi:", err.message);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchMateri();
  }, [id]);

  useEffect(() => {
    if (!gambarFileBaru) {
      setGambarPreviewBaru(null);
      return;
    }
    const objectUrl = URL.createObjectURL(gambarFileBaru);
    setGambarPreviewBaru(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [gambarFileBaru]);

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
    if (!judul || !deskripsi || !kategoriId) {
      toast.error("Judul, Deskripsi, dan Kategori tidak boleh kosong.");
      return;
    }
    if (!materiLama) {
      toast.error("Data materi lama tidak ditemukan.");
      return;
    }
    setIsSubmitting(true);

    try {
      let namaThumbnailFinal = materiLama.thumbnail;
      let namaGambarFinal = materiLama.gambar;

      if (thumbnailFileBaru) {
        const fileThumbnailExt = thumbnailFileBaru.name.split(".").pop();
        const namaThumbnailBaru = `thumbnail_isi_materi/${Date.now()}.${fileThumbnailExt}`;
        const { error: uploadError } = await supabase.storage
          .from("thumbnail_isi_materi")
          .upload(namaThumbnailBaru, thumbnailFileBaru);
        if (uploadError) throw uploadError;

        if (materiLama.thumbnail) {
          await supabase.storage
            .from("thumbnail_isi_materi")
            .remove([materiLama.thumbnail]);
        }
        namaThumbnailFinal = namaThumbnailBaru;
      }

      if (gambarFileBaru) {
        const fileGambarExt = gambarFileBaru.name.split(".").pop();
        const namaGambarBaru = `gambar_isi_materi/${Date.now()}.${fileGambarExt}`;
        const { error: uploadError } = await supabase.storage
          .from("gambar_isi_materi")
          .upload(namaGambarBaru, gambarFileBaru);
        if (uploadError) throw uploadError;

        if (materiLama.gambar) {
          await supabase.storage
            .from("gambar_isi_materi")
            .remove([materiLama.gambar]);
        }
        namaGambarFinal = namaGambarBaru;
      }

      const { error: updateError } = await supabase
        .from("isi_materi")
        .update({
          judul,
          deskripsi,
          kategori_id: kategoriId,
          thumbnail: namaThumbnailFinal,
          gambar: namaGambarFinal,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast.success("Isi Materi berhasil diperbarui");
      setTimeout(() => navigate("/dashboard/isi-materi"), 1500);
    } catch (err) {
      toast.error("Gagal memperbarui isi materi. Silakan coba lagi");
      console.error("Gagal:", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <p className="p-8 text-center text-gray-700">Memuat data editor...</p>
    );
  }

  {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
    <strong className="font-bold">Terjadi Kesalahan: </strong>
    <span className="block sm:inline">{error}</span>
  </div>
)}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/isi-materi")}
        className="flex items-center gap-2 mb-4 sm:mb-6 text-gray-600 hover:text-blue-600 text-sm sm:text-base"
      >
        <FaArrowLeft />
        <span>Kembali Ke Daftar</span>
      </button>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Edit Materi:{" "}
        <span className="text-indigo-600">{materiLama?.judul}</span>
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6 sm:space-y-8"
      >
        <InputField
          label="Judul Isi Materi"
          id="judul"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Masukkan Judul Baru"
        />

        <SelectKategori
          label="Kategori"
          value={kategoriId}
          onChange={(e) => setKategoriId(e.target.value)}
          options={kategoriList}
        />

        <FileUploadPreview
          label="Ganti Thumbnail (Opsional)"
          file={thumbnailFileBaru}
          setFile={setThumbnailFileBaru}
          preview={thumbnailPreviewBaru}
          previewLama={thumbnailPreviewLama}
          namaFileLama={materiLama?.thumbnail}
        />

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Deskripsi / Isi Materi
          </label>
          <QuillEditor
            value={deskripsi}
            onChange={(content) => setDeskripsi(content)}
            placeholder="Tulis isi materi disini..."
          />
        </div>

        <div className="mt-30">
          <FileUploadPreview
            label="Ganti Gambar (Opsional)"
            file={gambarFileBaru}
            setFile={setGambarFileBaru}
            preview={gambarPreviewBaru}
            previewLama={gambarPreviewLama}
            namaFileLama={materiLama?.gambar}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 sm:pt-4">
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
