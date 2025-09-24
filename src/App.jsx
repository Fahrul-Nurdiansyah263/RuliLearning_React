import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ListIsiMateriUser from "./pages/ListIsiMateriUser";
import HomeDashboard from "./components/DashboardLayout/HomeDashboard";
import KategoriMateri from "./components/DashboardLayout/KategoriMateri/KategoriMateri";
import AddKategoriMateri from "./components/DashboardLayout/KategoriMateri/AddKategoriMateri";
import EditKategoriMateri from "./components/DashboardLayout/KategoriMateri/editKategoriMateri";
import IsiMateri from "./components/DashboardLayout/IsiMateri/IsiMateri";
import AddIsiMateri from "./components/DashboardLayout/IsiMateri/AddIsiMateri";
import EditIsiMateri from "./components/DashboardLayout/IsiMateri/EditIsiMateri";
import DetailIsiMateri from "./pages/DetailIsiMateri";
import RuliAi from "./pages/RuliAi";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="list-isi-materi-user/:id" element={<ListIsiMateriUser />} />
      <Route path="detail-isi-materi/:id" element={<DetailIsiMateri />}/>
      <Route path="ruli-ai" element={<RuliAi />}/>
      

      <Route
        path="/login"
        element={!session ? <LoginPage /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={session ? <Dashboard /> : <Navigate to="/login" />}
      >
        <Route index element={<HomeDashboard />} />
        <Route path="home-dashboard" element={<HomeDashboard />} />
        <Route path="kategori-materi" element={<KategoriMateri />} />
        <Route path="tambah-kategori-materi" element={<AddKategoriMateri />} />
        <Route
          path="edit-kategori-materi/:id"
          element={<EditKategoriMateri />}
        />
        <Route path="isi-materi" element={<IsiMateri />} />
        <Route path="isi-materi/kategori/:kategoriId" element={<IsiMateri />} />
        <Route path="tambah-isi-materi" element={<AddIsiMateri />} />
         <Route
          path="edit-isi-materi/:id"
          element={<EditIsiMateri />}
        />
      </Route>
      <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
    </Routes>
  );
}
