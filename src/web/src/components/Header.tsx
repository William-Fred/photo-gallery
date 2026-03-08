import { NavLink } from 'react-router-dom'

const navLink = ({ isActive }: { isActive: boolean }) =>
  `text-xs tracking-widest uppercase font-light transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-300'}`

export default function Header() {
  return (
    <header className="border-b border-stone-800 px-8 py-5">
      <div className="max-w-screen-2xl mx-auto flex items-baseline justify-between">
        <NavLink to="/" className="font-serif text-lg tracking-wide text-stone-100 hover:text-stone-300 transition-colors">
          w_analoga
        </NavLink>
        <nav className="flex items-baseline gap-8">
          <NavLink to="/projects" className={navLink}>Projects</NavLink>
          <NavLink to="/wall" className={navLink}>Wall</NavLink>
          <span className="w-px h-3 bg-stone-800 self-center" />
          <NavLink to="/admin/upload" className={navLink}>Upload</NavLink>
          <NavLink to="/admin" end className={navLink}>Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}
