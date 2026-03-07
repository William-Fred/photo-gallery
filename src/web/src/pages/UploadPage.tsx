import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

type Project = {
  id: string
  name: string
  year: number | null
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(setProjects)
  }, [])

  function selectFile(selected: File) {
    setFile(selected)
    setUploadState('idle')
    setErrorMessage('')
    const url = URL.createObjectURL(selected)
    setPreview(url)
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

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
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
    setErrorMessage('')

    const formData = new FormData()
    formData.append('file', file)
    if (projectId) formData.append('projectId', projectId)

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      setUploadState('success')
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-8 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-serif text-stone-100 mb-2">Upload</h2>
        <p className="text-stone-500 text-sm font-light tracking-wide">
          Add a photograph to the gallery
        </p>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative border transition-colors duration-200',
          'flex items-center justify-center',
          file ? 'border-stone-700 cursor-default' : 'border-stone-700 cursor-pointer hover:border-amber-600/50',
          isDragging ? 'border-amber-600 bg-amber-600/5' : 'bg-stone-900/40',
        ].join(' ')}
        style={{ minHeight: '360px' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-96 max-w-full object-contain p-4"
          />
        ) : (
          <div className="text-center select-none">
            <div className="text-4xl text-stone-700 mb-4">+</div>
            <p className="text-stone-500 text-sm font-light">
              Drop a photo here, or click to browse
            </p>
          </div>
        )}
      </div>

      {/* Projekt */}
      <div className="mt-6">
        <label className="block text-xs tracking-widest uppercase text-stone-500 font-light mb-2">
          Project
        </label>
        <select
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
          className="w-full bg-stone-900/40 border border-stone-700 px-3 py-2 text-sm text-stone-300 font-light focus:outline-none focus:border-amber-600/50"
        >
          <option value="">— Wall (no project) —</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}{p.year ? ` (${p.year})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* File info */}
      {file && (
        <div className="mt-4 flex items-center justify-between text-xs text-stone-500 font-light">
          <span>{file.name}</span>
          <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploadState === 'uploading' || uploadState === 'success'}
          className={[
            'px-8 py-3 text-sm tracking-widest uppercase font-light transition-colors duration-200',
            !file || uploadState === 'uploading' || uploadState === 'success'
              ? 'bg-stone-800 text-stone-600 cursor-not-allowed'
              : 'bg-amber-700 text-stone-100 hover:bg-amber-600 cursor-pointer',
          ].join(' ')}
        >
          {uploadState === 'uploading' ? 'Uploading...' : 'Upload'}
        </button>

        {file && uploadState !== 'uploading' && (
          <button
            onClick={reset}
            className="px-4 py-3 text-sm text-stone-500 hover:text-stone-300 transition-colors duration-200 font-light"
          >
            Clear
          </button>
        )}
      </div>

      {/* Progress bar */}
      {uploadState === 'uploading' && (
        <div className="mt-6 h-px bg-stone-800 overflow-hidden">
          <div className="h-full bg-amber-600 animate-pulse w-full" />
        </div>
      )}

      {/* Success */}
      {uploadState === 'success' && (
        <div className="mt-6 text-sm text-stone-400 font-light tracking-wide">
          <span className="text-amber-600 mr-2">&#10003;</span>
          Photograph uploaded successfully.{' '}
          <button onClick={reset} className="underline underline-offset-4 hover:text-stone-200 transition-colors">
            Upload another
          </button>
        </div>
      )}

      {/* Error */}
      {uploadState === 'error' && (
        <div className="mt-6 text-sm text-red-400/80 font-light">
          {errorMessage}
        </div>
      )}
    </main>
  )
}
