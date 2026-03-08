import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

// förskjutningar för att bryta upp raden utan rotation
const offsets = [0, 40, 16]

export default function HomePage() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [projects, setProjects] = useState<Project[]>([])

    useEffect(() => {
        Promise.all([
            fetch('/api/photos').then(r => r.json()),
            fetch('/api/projects').then(r => r.json()),
        ]).then(([photoData, projectData]: [Photo[], Project[]]) => {
            setPhotos(photoData.slice(0, 3))
            setProjects(projectData)
        })
    }, [])

    return (
        <main className="max-w-screen-2xl mx-auto px-8">

            {/* Hero */}
            <section className="py-24 border-b border-stone-800">
                <p className="text-xs tracking-widest uppercase text-stone-600 mb-4">
                    analog photography
                </p>
                <h1 className="text-5xl md:text-7xl font-serif text-stone-100 mb-6 leading-tight">
                    William Fred
                </h1>
                <p className="text-stone-500 font-light max-w-md leading-relaxed">
                    Photographs shot on film. Moments captured in grain and light.
                </p>
            </section>

            {/* 3 bilder — förhandsvisning av väggen */}
            {photos.length > 0 && (
                <section className="py-16 border-b border-stone-800">
                    <div className="grid grid-cols-3 gap-10 items-start">
                        {photos.map((photo, i) => (
                            <div
                                key={photo.id}
                                className="group cursor-pointer"
                                style={{ marginTop: offsets[i] }}
                            >
                                <div className="relative overflow-hidden ring-1 ring-stone-700/50">
                                    <img
                                        src={`/api/photos/${photo.id}/file`}
                                        alt={photo.fileName}
                                        className="w-full block transition-opacity duration-300 group-hover:opacity-75"
                                        onError={e => { (e.target as HTMLImageElement).parentElement!.parentElement!.style.display = 'none' }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-stone-950/80 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                                        <p className="text-xs text-stone-300 truncate">{photo.fileName}</p>
                                        <p className="text-xs text-stone-600 mt-0.5">
                                            {new Date(photo.uploadedAt).toLocaleDateString('sv-SE')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projekt */}
            <section className="py-16">
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="text-xs tracking-widest uppercase text-stone-500">Projects</h2>
                    <Link to="/projects" className="text-xs text-stone-600 hover:text-stone-400 transition-colors tracking-wide">
                        View all →
                    </Link>
                </div>

                {projects.length === 0 && (
                    <p className="text-stone-600 font-light text-sm">No projects yet.</p>
                )}

                <div className="divide-y divide-stone-800/60">
                    {projects.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="flex items-baseline justify-between py-4 group"
                        >
                            <span className="text-stone-300 font-light group-hover:text-amber-500 transition-colors">
                                {project.name}
                            </span>
                            <span className="text-xs text-stone-600 font-light">
                                {project.year ?? '—'}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

        </main>
    )
}
