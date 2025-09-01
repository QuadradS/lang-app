import {Link} from "react-router";

export const MainLayout = ({children}) => {
  return (
    <main className="relative bg-[#f6f6fa]">
      <header className="w-full px-6 py-3 max-w-[1280px] mx-auto bg-white flex items-center">
        <h1 className="text-2xl">QL Dashboard</h1>
        <Link className="text-md ml-10" to="/learn">Learn</Link>
        <Link className="text-md ml-4" to="/">Manage words</Link>
      </header>
      <div className="px-3 py-2 w-full min-h-[100vh] max-w-[1280px] mx-auto">
        {children}
      </div>
    </main>
  )
}
