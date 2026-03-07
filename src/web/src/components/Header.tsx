import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="border-b border-stone-800 px-8 py-6">
      <div className="max-w-screen-2xl mx-auto flex items-baseline justify-between">
        <NavLink to="/" className="text-2xl font-serif tracking-wide text-stone-100 hover:text-stone-300 transition-colors">
          Analog Gallery
        </NavLink>
        <nav className="flex items-baseline gap-6">
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `text-xs tracking-widest uppercase font-light transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-300'}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/admin/upload"
            className={({ isActive }) =>
              `text-xs tracking-widest uppercase font-light transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-300'}`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `text-xs tracking-widest uppercase font-light transition-colors ${isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-300'}`
            }
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
