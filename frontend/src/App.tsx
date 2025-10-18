import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import LandingPage from "./pages/LandingPage";
import SongLibraryPage from "./pages/SongLibraryPage";
import SongDetailPage from "./pages/SongDetailPage";
import ChordLibraryPage from "./pages/ChordLibraryPage";
import ChordDetailPage from "./pages/ChordDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Container>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/songs" element={<SongLibraryPage />} />
              <Route path="/songs/:id" element={<SongDetailPage />} />
              <Route path="/chords" element={<ChordLibraryPage />} />
              <Route path="/chords/:id" element={<ChordDetailPage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
