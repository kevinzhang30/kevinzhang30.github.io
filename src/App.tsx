import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import SceneCanvas from "./features/scene/SceneCanvas";
import { PanelVisibilityProvider } from "./features/scene/panelVisibility";
import { useMobileFallback } from "./features/scene/hooks/useMobileFallback";

const Map = lazy(() => import("./pages/Map"));
const MobileLayout = lazy(() => import("./pages/mobile/MobileLayout"));
const MobileHome = lazy(() => import("./pages/mobile/MobileHome"));
const Experience = lazy(() => import("./pages/Experience"));
const Projects = lazy(() => import("./pages/Projects"));
const Gallery = lazy(() => import("./pages/Gallery"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
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
            <Route path="/admin/projects" element={<AdminProjects />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

/**
 * Desktop scene shell. SceneCanvas is mounted once for scene-backed routes.
 * `/map` bypasses the scene entirely and renders the three.js globe page so
 * the scene canvas unmounts and releases its GPU resources while the map is up.
 */
function SceneRoutes() {
  const { pathname } = useLocation();

  if (pathname === "/map") {
    return (
      <Suspense fallback={null}>
        <Map />
      </Suspense>
    );
  }

  return (
    <PanelVisibilityProvider>
      <SceneCanvas />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </Suspense>
    </PanelVisibilityProvider>
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
