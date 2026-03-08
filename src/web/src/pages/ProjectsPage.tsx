import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

type Project = {
    id: string
    name: string
    year: number | null
    description: string | null
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then((data: Project[]) => {
                setProjects(data)
                setLoading(false)
            })
    }, [])

    return (
        <main className="max-w-screen-2xl mx-auto px-8 py-16">
            <div className="mb-16">
                <h2 className="text-3xl font-serif text-stone-100 mb-2">Projects</h2>
                <p className="text-stone-500 text-sm font-light tracking-wide">
                    Analog photography
                </p>
            </div>

            {loading && <p className="text-stone-500 font-light">Loading...</p>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map(project => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="group border border-stone-800 p-6 hover:border-stone-600 transition-colors duration-200"
                    >
                        <div className="text-stone-200 font-serif text-lg mb-1 group-hover:text-amber-500 transition-colors">
                            {project.name}
                        </div>
                        {project.year && (
                            <div className="text-xs text-stone-500 font-light mb-2">{project.year}</div>
                        )}
                        {project.description && (
                            <div className="text-xs text-stone-600 font-light leading-relaxed">
                                {project.description}
                            </div>
                        )}
                    </Link>
                ))}

                {/* Wall-kort */}
                <Link
                    to="/wall"
                    className="group border border-stone-800 border-dashed p-6 hover:border-stone-600 transition-colors duration-200"
                >
                    <div className="text-stone-500 font-serif text-lg mb-1 group-hover:text-stone-300 transition-colors">
                        Wall
                    </div>
                    <div className="text-xs text-stone-600 font-light">
                        Photographs without a project
                    </div>
                </Link>
            </div>
        </main>
    )
}
