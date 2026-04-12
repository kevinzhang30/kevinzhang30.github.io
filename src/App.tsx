import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const Map = lazy(() => import("./pages/Map"));
const HomeScenePage = lazy(() => import("./features/home-scene/HomeScenePage"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminTravel = lazy(() => import("./pages/admin/AdminTravel"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <AuthProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/experience" element={<AdminExperience />} />
              <Route path="/admin/trips" element={<AdminTravel />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    );
  }

  const isMap = pathname === "/map";
  const isHome = pathname === "/";

  return (
    <div className={isMap || isHome ? "" : "flex min-h-screen flex-col"}>
      {!isMap && !isHome && <Nav />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomeScenePage />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Suspense>
      {!isMap && !isHome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
