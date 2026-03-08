import { useState, useEffect } from "react";
import Lightbox from "../components/Lightbox";

type Photo = {
    id: string
    fileName: string
    uploadedAt: string
}

const PAGE_SIZE = 24;

export default function GalleryPage() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        async function fetchPhotos() {
            setLoading(true);
            setVisible(false);
            setError(null);
            try {
                const res = await fetch(`/api/photos/wall?page=${page}&pageSize=${PAGE_SIZE}`);
                if (!res.ok) throw new Error(`Failed to fetch photos: ${res.statusText}`);
                const photoData: Photo[] = await res.json();
                setPhotos(photoData);
                setTotal(photoData.length);
                setTimeout(() => setVisible(true), 50);
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
    <>
        <main className="max-w-screen-2xl mx-auto px-8 py-16">
            <h2 className="text-3xl font-serif text-stone-100 mb-10">Wall</h2>

            {loading && <p className="text-stone-500">Loading photos...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {!loading && !error && photos.length === 0 && (
                <p className="text-stone-500 font-light">No photographs yet.</p>
            )}

            {/* fotovägg — masonry */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-5">
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        className="mb-5 break-inside-avoid cursor-pointer group relative"
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(12px)',
                            transition: `opacity 0.4s ease ${(i % 12) * 40}ms, transform 0.4s ease ${(i % 12) * 40}ms`,
                        }}
                        onClick={() => setSelectedIndex(i)}
                    >
                        <div className="relative bg-stone-100 p-2 pb-7 shadow-lg shadow-stone-950/50 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-stone-950/70 group-hover:-translate-y-0.5">
                            <img
                                src={`/api/photos/${photo.id}/file`}
                                alt={photo.fileName}
                                className="w-full block transition-all duration-300 group-hover:brightness-105"
                                onError={e => { (e.target as HTMLImageElement).parentElement!.parentElement!.style.display = 'none' }}
                            />
                            {/* datum i penntext nere på "passepatout"-ytan */}
                            <p className="text-center text-stone-400 text-[10px] font-light tracking-wide mt-1.5 select-none">
                                {new Date(photo.uploadedAt).toLocaleDateString('sv-SE')}
                            </p>
                            {/* hover overlay med filnamn */}
                            <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/20 transition-colors duration-300 pointer-events-none" />
                        </div>
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
