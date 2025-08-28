export const MainLayout = ({children}) => {
  return (
    <main className="relative bg-[#f6f6fa]">
      <header className="w-full px-6 py-3 max-w-[1280px] mx-auto bg-white">
        <h1 className="text-2xl">QL Dashboard</h1>
      </header>
      <div className="px-3 py-2 w-full min-h-[100vh] max-w-[1280px] mx-auto">
        {children}
      </div>
    </main>
  )
}
