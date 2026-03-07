import { useState, useEffect } from 'react'

type Project = {
    id: string
    name: string
    year: number | null
    description: string | null
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [year, setYear] = useState('')
    const [description, setDescription] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        setLoading(true)
        const res = await fetch('/api/projects')
        const data: Project[] = await res.json()
        setProjects(data)
        setLoading(false)
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setSaving(true)
        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                year: year ? parseInt(year) : null,
                description: description.trim() || null,
            }),
        })
        setName('')
        setYear('')
        setDescription('')
        setSaving(false)
        fetchProjects()
    }

    async function handleDelete(id: string) {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        setProjects(prev => prev.filter(p => p.id !== id))
    }

    return (
        <main className="max-w-screen-2xl mx-auto px-8 py-16">
            <h2 className="text-3xl font-serif text-stone-100 mb-10">Admin — Projects</h2>

            {/* Skapa projekt */}
            <form onSubmit={handleCreate} className="mb-12 border border-stone-800 p-6">
                <h3 className="text-xs tracking-widest uppercase text-stone-500 font-light mb-6">New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-stone-500 font-light mb-2">Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Island"
                            required
                            className="w-full bg-stone-900/40 border border-stone-700 px-3 py-2 text-sm text-stone-300 font-light placeholder:text-stone-700 focus:outline-none focus:border-amber-600/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-stone-500 font-light mb-2">Year</label>
                        <input
                            type="number"
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            placeholder={String(new Date().getFullYear())}
                            className="w-full bg-stone-900/40 border border-stone-700 px-3 py-2 text-sm text-stone-300 font-light placeholder:text-stone-700 focus:outline-none focus:border-amber-600/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-stone-500 font-light mb-2">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Optional"
                            className="w-full bg-stone-900/40 border border-stone-700 px-3 py-2 text-sm text-stone-300 font-light placeholder:text-stone-700 focus:outline-none focus:border-amber-600/50"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving || !name.trim()}
                    className={[
                        'px-8 py-3 text-sm tracking-widest uppercase font-light transition-colors duration-200',
                        saving || !name.trim()
                            ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
                            : 'bg-amber-700 text-stone-100 hover:bg-amber-600 cursor-pointer',
                    ].join(' ')}
                >
                    {saving ? 'Saving...' : 'Create'}
                </button>
            </form>

            {/* Projektlista */}
            {loading && <p className="text-stone-500">Loading...</p>}
            {!loading && projects.length === 0 && (
                <p className="text-stone-500 font-light">No projects yet.</p>
            )}
            <div className="divide-y divide-stone-800">
                {projects.map(project => (
                    <div key={project.id} className="py-4 flex items-baseline justify-between group">
                        <div>
                            <span className="text-stone-200 font-light">{project.name}</span>
                            {project.year && (
                                <span className="ml-3 text-xs text-stone-500">{project.year}</span>
                            )}
                            {project.description && (
                                <span className="ml-3 text-xs text-stone-600 font-light">{project.description}</span>
                            )}
                        </div>
                        <button
                            onClick={() => handleDelete(project.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-stone-500 hover:text-red-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}
