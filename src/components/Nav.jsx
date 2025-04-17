import { Link } from "react-router-dom";
export default function Nav() {
  return (
    <>
      <nav className="navbar bg-primary p-4 text-white shadow-lg">
        <div className="navbar-start">
          <h1 className="text-2xl font-bold hover:text-secondary transition">
            <Link to="/">LOGO</Link>
          </h1>
        </div>
        <div className="navbar-end">
          {/* Mobile Menu */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden hover:bg-secondary hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="text-black dropdown-content menu menu-sm z-10 mt-3 w-52 p-2 rounded-box bg-primary-content shadow-lg"
            >
              <li>
                <Link
                  to="/"
                  className="hover:bg-secondary hover:text-white transition"
                >
                  จดหมาย
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-maills"
                  className="hover:bg-secondary hover:text-white transition"
                >
                  แก้ไข
                </Link>
              </li>
            </ul>
          </div>
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-4">
            <Link
              to="/"
              className="btn btn-ghost text-xl hover:bg-secondary hover:text-white transition"
            >
              จดหมาย
            </Link>
            <Link
              to="/manage-maills"
              className="btn btn-ghost text-xl hover:bg-secondary hover:text-white transition"
            >
              แก้ไข
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
