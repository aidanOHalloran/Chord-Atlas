import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import SongLibraryPage from "./pages/SongLibraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/songs" element={<SongLibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}