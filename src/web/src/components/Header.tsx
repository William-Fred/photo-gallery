export default function Header() {
  return (
    <header className="border-b border-stone-800 px-8 py-6">
      <div className="max-w-4xl mx-auto flex items-baseline justify-between">
        <h1 className="text-2xl font-serif tracking-wide text-stone-100">
          Analog Gallery
        </h1>
        <span className="text-xs tracking-widest uppercase text-stone-500 font-light">
          Admin
        </span>
      </div>
    </header>
  )
}
