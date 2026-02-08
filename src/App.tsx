import { BrowserRouter, Routes, Route } from "react-router-dom";

function Placeholder({ page }: { page: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-400">
        {page}
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder page="Home" />} />
        <Route
          path="/experience"
          element={<Placeholder page="Experience" />}
        />
        <Route path="/projects" element={<Placeholder page="Projects" />} />
        <Route path="/gallery" element={<Placeholder page="Gallery" />} />
        <Route path="/map" element={<Placeholder page="Map" />} />
      </Routes>
    </BrowserRouter>
  );
}
