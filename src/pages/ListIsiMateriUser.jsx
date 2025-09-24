import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import IsiMateriCard from "../components/common/IsiMateriCard";
import SkeletonIsiMateri from "../components/common/SkeletonIsiMateri";

export default function ListIsiMateriUser() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [materiList, setMateriList] = useState([]);
  const [namaKategori, setNamaKategori] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMateri = async () => {
      const { data, error } = await supabase
        .from("isi_materi")
        .select("*, kategori_materi(judul)")
        .eq("kategori_id", id);

      if (error) console.error(error);
      else {
        setMateriList(data);
        if (data.length > 0) {
          setNamaKategori(data[0].kategori_materi.judul);
        }
      }
      setIsLoading(false);
    };

    fetchMateri();
  }, [id]);

  if (isLoading) {
    return <SkeletonIsiMateri />;
  }

  return (
    <div>
      <div className="flex ml-10 mt-5">
        <button
          onClick={() => navigate(-1)}
          className=" bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow"
        >
          ← Kembali
        </button>
      </div>

      <IsiMateriCard
        kategoriId={id}
        namaKategori={namaKategori}
        materiList={materiList}
        isAdmin={false}
        onNavigate={(id) => navigate(`/detail-isi-materi/${id}`)}
      />
    </div>
  );
}
