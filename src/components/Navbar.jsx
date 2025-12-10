import { Link, NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-semibold ${
        isActive ? 'text-blue-700' : 'text-gray-800 hover:text-blue-700'
    }`

export default function Navbar() {
    return (
        <header className="border-b border-cyan-200 bg-cyan-100">
            <div className="mx-auto grid h-16 w-full max-w-4xl grid-cols-3 items-center px-4">
                <div />{/* left spacer column */}
                <Link
                    to="/"
                    className="col-start-2 justify-self-center text-center text-xl font-bold text-gray-900"
                >
                    Board Game Meetups
                </Link>
                <nav className="col-start-3 justify-self-end flex items-center gap-4">
                    <NavLink to="/" className={"font-bold text-gray-900"} end>
                        Home
                    </NavLink>
                    <NavLink to="/create" className={"rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"}>
                        Create Event
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

