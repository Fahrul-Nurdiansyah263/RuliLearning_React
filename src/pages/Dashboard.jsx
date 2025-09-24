import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { IoHome, IoBookSharp, IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6"; 
import { GiHamburgerMenu } from "react-icons/gi";
import { TbLogout2 } from "react-icons/tb";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const NavLink = ({ to, icon, children }) => (
    <Link
      to={to}
      className={`group flex items-center w-full p-3 rounded-lg transition-colors ${
        location.pathname === to
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      } ${isCollapse && !isMobileMenuOpen ? "justify-center" : ""}`}
    >
      <div
        className={`grid place-items-center transition-transform duration-200 group-hover:scale-110 text-xl ${
          isCollapse && !isMobileMenuOpen ? "mr-0" : "mr-4"
        }`}
      >
        {icon}
      </div>
      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          isCollapse && !isMobileMenuOpen ? "opacity-0 w-0" : "opacity-100"
        }`}
      >
        {children}
      </span>
    </Link>
  );

  return (
    <div className="relative min-h-screen bg-gray-100">
      <aside
        onMouseEnter={() => isCollapse && setIsCollapse(false)}
        className={`fixed inset-y-0 left-0 flex flex-col bg-white p-4 shadow-xl transition-all transform duration-300 z-40
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapse ? "md:w-20" : "md:w-64"}
        `}
      >
        <div className="flex items-center justify-between mb-2 p-4">
          <h5
            className={`block text-xl font-semibold text-gray-900 font-serif whitespace-nowrap transition-opacity ${
              isCollapse ? "md:opacity-0" : "opacity-100"
            }`}
          >
            RuliLearning
          </h5>
          <button
            onClick={() => setIsCollapse(true)}
            className={`hidden md:block absolute top-7 right-3 p-2 rounded-lg hover:bg-gray-100 ${
              isCollapse ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <GiHamburgerMenu />
          </button>
        </div>

        <nav className="flex flex-col flex-grow gap-1 text-base font-medium">
          <NavLink to="/dashboard/home-dashboard" icon={<IoHome />}>Home</NavLink>
          <div className={`flex ml-4 py-4 text-sm text-gray-500 font-semibold ${isCollapse ? "md:hidden" : "block"}`}>
            Materi
          </div>
          <NavLink to="/dashboard/kategori-materi" icon={<IoBookSharp />}>Kategori Materi</NavLink>
          <NavLink to="/dashboard/isi-materi" icon={<IoBookSharp />}>Isi Materi</NavLink>

          <div
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            className={`group flex items-center w-full p-3 rounded-lg mt-auto transition-all text-red-500 hover:bg-red-50 ${
              isCollapse && !isMobileMenuOpen ? "justify-center text-2xl" : ""
            }`}
          >
            <div className={`grid place-items-center transition-transform duration-200 group-hover:scale-110 text-xl ${isCollapse && !isMobileMenuOpen ? "mr-0" : "mr-4"}`}>
              <TbLogout2 />
            </div>
            <span className={`whitespace-nowrap transition-opacity duration-200 ${isCollapse && !isMobileMenuOpen ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
              Log Out
            </span>
          </div>
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <main
        className={`p-4 md:p-8 transition-all duration-300 ease-in-out ${
          isCollapse ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <div className="md:hidden flex items-center mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 bg-white shadow-md"
          >
            {isMobileMenuOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
          </button>
          <h5 className="ml-4 text-lg font-bold">RuliLearning</h5>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg min-h-[calc(100vh-4rem)]">
          <Outlet context={{ userEmail }} />
        </div>
      </main>
    </div>
  );
}