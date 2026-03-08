import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Lightbox from '../components/Lightbox'

type Photo = {
    id: string
    fileName: string
    uploadedAt: string
}

type Project = {
    id: string
    name: string
    year: number | null
    description: string | null
}

export default function ProjectPage() {
    const { id } = useParams<{ id: string }>()
    const [project, setProject] = useState<Project | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const [projectRes, photosRes] = await Promise.all([
                    fetch(`/api/projects/${id}`),
                    fetch(`/api/photos?projectId=${id}`),
                ])
                if (!projectRes.ok) throw new Error('Project not found')
                const [projectData, photosData] = await Promise.all([
                    projectRes.json(),
                    photosRes.json(),
                ])
                setProject(projectData)
                setPhotos(photosData)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    return (
    <>
        <main className="max-w-screen-2xl mx-auto px-8 py-16">
            <Link to="/" className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-300 transition-colors font-light">
                ← Projects
            </Link>

            {loading && <p className="text-stone-500 mt-10">Loading...</p>}
            {error && <p className="text-red-400 mt-10">{error}</p>}

            {project && (
                <div className="mt-8 mb-12">
                    <h2 className="text-3xl font-serif text-stone-100 mb-1">{project.name}</h2>
                    <div className="flex items-baseline gap-4">
                        {project.year && (
                            <span className="text-sm text-stone-500 font-light">{project.year}</span>
                        )}
                        {project.description && (
                            <span className="text-sm text-stone-600 font-light">{project.description}</span>
                        )}
                    </div>
                </div>
            )}

            {!loading && !error && photos.length === 0 && (
                <p className="text-stone-500 font-light">No photographs in this project yet.</p>
            )}

            <div className="columns-2 md:columns-3 gap-4">
                {photos.map((photo, i) => (
                    <div key={photo.id} className="mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden" onClick={() => setSelectedIndex(i)}>
                        <img
                            src={`/api/photos/${photo.id}/file`}
                            alt={photo.fileName}
                            className="w-full block transition-opacity duration-300 group-hover:opacity-75"
                            onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none' }} />
                        <div className="absolute bottom-0 left-0 right-0 bg-stone-950/80 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                            <p className="text-xs text-stone-300 truncate">{photo.fileName}</p>
                            <p className="text-xs text-stone-600 mt-0.5">
                                {new Date(photo.uploadedAt).toLocaleDateString('sv-SE')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </main>

        {selectedIndex !== null && (
            <Lightbox
                photos={photos}
                index={selectedIndex}
                onClose={() => setSelectedIndex(null)}
                onNavigate={setSelectedIndex}
            />
        )}
    </>
    )
}
