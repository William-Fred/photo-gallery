import { useEffect } from 'react'

type Photo = {
    id: string
    fileName: string
    uploadedAt: string
}

type Props = {
    photos: Photo[]
    index: number
    onClose: () => void
    onNavigate: (index: number) => void
}

export default function Lightbox({ photos, index, onClose, onNavigate }: Props) {
    const photo = photos[index]

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') { onClose() }
            if (e.key === 'ArrowRight' && index < photos.length - 1) { onNavigate(index + 1) }
            if (e.key === 'ArrowLeft' && index > 0) { onNavigate(index - 1) }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [index, photos.length, onClose, onNavigate])

    const formatted = new Date(photo.uploadedAt).toLocaleDateString('sv-SE', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <div
            className="fixed inset-0 z-50 bg-stone-950/95 flex flex-col"
            onClick={onClose}
        >
            {/* Topprad */}
            <div
                className="flex items-center justify-between px-8 py-4 shrink-0"
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <p className="text-stone-300 text-sm font-light">{photo.fileName}</p>
                    <p className="text-stone-600 text-xs font-light mt-0.5">{formatted}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-stone-500 hover:text-stone-200 transition-colors p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Bild */}
            <div
                className="flex-1 flex items-center justify-center px-16 min-h-0"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={`/api/photos/${photo.id}/file`}
                    alt={photo.fileName}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            {/* Navigation */}
            <div
                className="flex items-center justify-center gap-8 px-8 py-4 shrink-0"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={() => onNavigate(index - 1)}
                    disabled={index === 0}
                    className="text-stone-500 hover:text-stone-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <span className="text-stone-600 text-xs font-light tabular-nums">
                    {index + 1} / {photos.length}
                </span>
                <button
                    onClick={() => onNavigate(index + 1)}
                    disabled={index === photos.length - 1}
                    className="text-stone-500 hover:text-stone-200 transition-colors disabled:opacity-20 disabled:cursor-not-allowed p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
