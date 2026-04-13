import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SceneCanvas from "./features/scene/SceneCanvas";
import { useMobileFallback } from "./features/scene/hooks/useMobileFallback";
import MobileLayout from "./pages/mobile/MobileLayout";
import MobileHome from "./pages/mobile/MobileHome";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";

const Map = lazy(() => import("./pages/Map"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminTravel = lazy(() => import("./pages/admin/AdminTravel"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));

function AdminRoutes() {
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

function MobileRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<MobileHome />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/map" element={<Map />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

/**
 * Desktop scene shell. SceneCanvas is mounted once and reads the route itself
 * via useDestinationFromRoute. The <Routes> block exists so route changes
 * register with react-router (the back button works, useLocation fires), but
 * each Route renders `null` because SceneCanvas owns the rendering.
 */
function SceneRoutes() {
  return (
    <>
      <SceneCanvas />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/experience" element={null} />
        <Route path="/projects" element={null} />
        <Route path="/gallery" element={null} />
        <Route path="/map" element={null} />
      </Routes>
    </>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isMobile = useMobileFallback();

  if (isAdmin) {
    return <AdminRoutes />;
  }

  if (isMobile) {
    return <MobileRoutes />;
  }

  return <SceneRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
