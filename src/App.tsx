import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import PageShell from "./components/layout/PageShell";
import Experience from "./pages/Experience";
import Home from "./pages/Home";
import Projects from "./pages/Projects";

function Placeholder({ page }: { page: string }) {
  return (
    <PageShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-300">
          {page}
        </h1>
      </div>
    </PageShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Placeholder page="Gallery" />} />
          <Route path="/map" element={<Placeholder page="Map" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
