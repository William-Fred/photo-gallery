import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import ProjectPage from './pages/ProjectPage'
import UploadPage from './pages/UploadPage'
import AdminGalleryPage from './pages/AdminGalleryPage'
import AdminProjectsPage from './pages/AdminProjectsPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wall" element={<GalleryPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/admin" element={<AdminGalleryPage />} />
          <Route path="/admin/upload" element={<UploadPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
