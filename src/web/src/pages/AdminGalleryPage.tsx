import { useState, useEffect } from "react";

type Photo = {
    id: string
    fileName: string
    uploadedAt: string
}

const PAGE_SIZE = 12;

export default function AdminGalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function fetchPhotos() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/photos?page=${page}&pageSize=${PAGE_SIZE}`);
                if (!res.ok) throw new Error(`Failed to fetch photos: ${res.statusText}`);
                const photoData: Photo[] = await res.json();
                setPhotos(photoData);
                setTotal(photoData.length);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchPhotos();
    }, [page]);

    async function deletePhoto(id: string) {
        await fetch(`/api/photos/${id}`, { method: 'DELETE' })
        setPhotos(prev => prev.filter(p => p.id !== id))
        setTotal(prev => prev - 1)
    }

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <main className="max-w-screen-2xl mx-auto px-8 py-16">
            <h2 className="text-3xl font-serif text-stone-100 mb-10">Admin — Gallery</h2>

            {loading && <p className="text-stone-500">Loading photos...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && photos.length === 0 && (
                <p className="text-stone-500 font-light">No photographs yet.</p>
            )}

            <div className="columns-2 md:columns-3 gap-4">
                {photos.map(photo => (
                    <div key={photo.id} className="mb-4 break-inside-avoid relative group overflow-hidden">
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
                        <button
                            onClick={() => deletePhoto(photo.id)}
                            className="absolute top-2 right-2 p-2 bg-stone-900/80 text-stone-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
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

            {totalPages > 1 && (
                <div className="mt-12 flex gap-2 justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={[
                                'w-8 h-8 text-sm font-light transition-colors',
                                p === page
                                    ? 'bg-amber-700 text-stone-100'
                                    : 'text-stone-500 hover:text-stone-300',
                            ].join(' ')}>
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </main>
    )
}
