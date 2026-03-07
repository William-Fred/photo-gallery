import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import GalleryPage from './pages/GalleryPage'
import UploadPage from './pages/UploadPage'
import AdminGalleryPage from './pages/AdminGalleryPage'
import AdminProjectsPage from './pages/AdminProjectsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminGalleryPage />} />
          <Route path="/admin/upload" element={<UploadPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
