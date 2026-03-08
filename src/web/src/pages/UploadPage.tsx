import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

type UploadState = 'idle' | 'uploading' | 'error'

type Project = {
  id: string
  name: string
  year: number | null
}

type Toast = { message: string; type: 'success' | 'error' }

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  function selectFile(selected: File) {
    setFile(selected)
    setUploadState('idle')
    setErrorMessage('')
    setPreview(URL.createObjectURL(selected))
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) selectFile(selected)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) selectFile(dropped)
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setUploadState('idle')
    setErrorMessage('')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleUpload() {
    if (!file) return
    setUploadState('uploading')

    const formData = new FormData()
    formData.append('file', file)
    if (projectId) { formData.append('projectId', projectId) }

    try {
      const response = await fetch('/api/photos', { method: 'POST', body: formData })
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      setToast({ message: 'Photograph uploaded successfully.', type: 'success' })
      reset()
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setToast({ message: 'Upload failed.', type: 'error' })
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-stone-100 mb-2">Upload</h2>
        <p className="text-stone-500 text-sm font-light tracking-wide">Add a photograph to the gallery</p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        className={[
          'relative border transition-colors duration-200 flex items-center justify-center',
          file ? 'border-stone-700 cursor-default' : 'border-stone-700 cursor-pointer hover:border-amber-600/50',
          isDragging ? 'border-amber-600 bg-amber-600/5' : 'bg-stone-900/40',
        ].join(' ')}
        style={{ minHeight: '200px' }}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {preview ? (
          <img src={preview} alt="Preview" className="max-h-48 max-w-full object-contain p-3" />
        ) : (
          <div className="text-center select-none py-8">
            <div className="text-3xl text-stone-700 mb-3">+</div>
            <p className="text-stone-500 text-sm font-light">Drop a photo here, or click to browse</p>
          </div>
        )}
      </div>

      {/* File info */}
      {file && (
        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-light">
          <span>{file.name}</span>
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      )}

      {/* Projekt */}
      <div className="mt-5">
        <label className="block text-xs tracking-widest uppercase text-stone-500 font-light mb-2">Project</label>
        <select
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
          className="w-full bg-stone-900/40 border border-stone-700 px-3 py-2 text-sm text-stone-300 font-light focus:outline-none focus:border-amber-600/50"
        >
          <option value="">— Wall (no project) —</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}{p.year ? ` (${p.year})` : ''}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploadState === 'uploading'}
          className={[
            'px-8 py-3 text-sm tracking-widest uppercase font-light transition-colors duration-200',
            !file || uploadState === 'uploading'
              ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
              : 'bg-amber-700 text-stone-100 hover:bg-amber-600 cursor-pointer',
          ].join(' ')}
        >
          {uploadState === 'uploading' ? 'Uploading...' : 'Upload'}
        </button>

        {file && uploadState !== 'uploading' && (
          <button onClick={reset} className="px-4 py-3 text-sm text-stone-500 hover:text-stone-300 transition-colors font-light">
            Clear
          </button>
        )}
      </div>

      {/* Progress bar */}
      {uploadState === 'uploading' && (
        <div className="mt-4 h-px bg-stone-800 overflow-hidden">
          <div className="h-full bg-amber-600 animate-pulse w-full" />
        </div>
      )}

      {/* Error */}
      {uploadState === 'error' && (
        <p className="mt-4 text-sm text-red-400/80 font-light">{errorMessage}</p>
      )}

      {/* Toast */}
      {toast && (
        <div className={[
          'fixed bottom-6 right-6 px-5 py-3 text-sm font-light tracking-wide shadow-lg transition-all duration-300',
          toast.type === 'success' ? 'bg-stone-800 text-stone-200 border-l-2 border-amber-600' : 'bg-stone-800 text-red-400 border-l-2 border-red-600',
        ].join(' ')}>
          {toast.message}
        </div>
      )}
    </main>
  )
}
