import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import SkeletonCard from "../components/common/SkeletonCard";
import KategoriCard from "../components/common/KategoriCard";
import { supabase } from "../services/supabaseClient";
import ChatWidget from "../components/common/ChatWidget";

export default function HomePage() {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ambilSemuaKategori();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    AOS.refresh();
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
      setError("Gagal mengambil data kategori");
      console.error("Error fetching categories:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (error) {
    {
      error && <p className="text-red-500 text-center mt-4">{error}</p>;
    }
  }

  return (
    <div>
      <nav className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <p className="text-xl font-bold text-blue-600">RuliLearning</p>
          </div>
        </div>
      </nav>

      <main>
        <section
          className="py-20 md:py-40"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div className="container mx-auto flex flex-col items-center px-4 text-center sm:px-6">
            <h1 className="text-3xl font-bold leading-tight md:text-6xl mb-4 font-poppins">
              Belajar Lebih Cerdas,
              <span className="block md:inline">Bukan Lebih Keras.</span>
            </h1>
            <p className="max-w-3xl text-lg md:text-xl font-inter mb-8">
              Ubah konsep abstrak menjadi viusal yang nyata
            </p>
            <a
              href="#materi"
              className="inline-block rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-700 md:px-8"
            >
              Mulai belajar sekarang
            </a>
          </div>
        </section>

        <section
          className="bg-white py-16"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-center text-xl font-bold text-gray-800">
              Mengapa Memilih RuliLearning
            </h2>
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4 ">
              <div
                className="rounded-lg p-6 transition duration-300 hover:shadow-lg"
                data-aos="fade-left"
                data-aos-duration="1000"
              >
                <div className="mb-4 text-5xl ">🎓</div>
                <h3 className="mb-2 text-xl font-bold">Instruktur Ahli</h3>
                <p className="text-gray-600">
                  Belajar langsung dari para profesional yang berpengalaman di
                  bidangnya.
                </p>
              </div>
              <div
                className="rounded-lg p-6 transition duration-300 hover:shadow-lg"
                data-aos="fade-left"
                data-aos-duration="1500"
              >
                <div className="mb-4 text-5xl ">🤖</div>
                <h3 className="mb-2 text-xl font-bold">Asisten AI Chatbot</h3>
                <p className="text-gray-600">
                  Dapatkan jawaban instan dan bantuan belajar kapan saja melalui
                  asisten AI kami.
                </p>
              </div>
              <div
                className="rounded-lg p-6 transition duration-300 hover:shadow-lg"
                data-aos="fade-left"
                data-aos-duration="2000"
              >
                <div className="mb-4 text-5xl ">💻</div>
                <h3 className="mb-2 text-xl font-bold">Akses Fleksibel</h3>
                <p className="text-gray-600">
                  Belajar kapan saja dan di mana saja sesuai dengan kecepatan
                  Anda sendiri.
                </p>
              </div>
              <div
                className="rounded-lg p-6 transition duration-300 hover:shadow-lg"
                data-aos="fade-left"
                data-aos-duration="2500"
              >
                <div className="mb-4 text-5xl">📱</div>
                <h3 className="mb-2 text-xl font-bold">
                  Pembelajaran AR Interaktif
                </h3>
                <p className="text-gray-600">
                  Visualisasikan konsep sulit menjadi objek 3D langsung di dunia
                  nyata.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="materi" className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
              Materi
            </h2>
            {kategoriList.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {kategoriList.map((kategori) => (
                  <KategoriCard
                    key={kategori.id}
                    kategori={kategori}
                    onNavigate={() =>
                      navigate(`list-isi-materi-user/${kategori.id}`)
                    }
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
        </section>
      </main>

      <ChatWidget />

      <footer className="bg-gray-800 text-gray-300 font-inter">
        <div className="container mx-auto py-10 px-6 lg:px-8">
          <div className="mt-8 pt-5 border-t border-gray-700 text-center text-sm text-gray-500">
            <p>&copy; 2025 RuliLearning. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
