import { useState, useEffect } from "react";

type Photo = {
    id: string
    fileName: string
    uploadedAt: string
}

const PAGE_SIZE = 12;

export default function GalleryPage() {
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

                if (!res.ok) {
                    throw new Error(`Failed to fetch photos: ${res.statusText}`);
                }
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

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <main className="max-w-6xl mx-auto px-8 py-16">
            <h2 className="text-3xl font-serif text-stone-100 mb-10">Gallery</h2>

            {loading && <p className="text-stone-500">Loading photos...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && photos.length === 0 && (
                <p className="text-stone-500 font-light">No photographs yet.</p>
            )}

            {/* bildgrid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map(photo => (
                    <div key={photo.id} className="aspect-square bg-stone-900 overflow-hidden">
                        <img
                            src={`/api/photos/${photo.id}/file`}
                            alt={photo.fileName}
                            className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* paginering */}
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
