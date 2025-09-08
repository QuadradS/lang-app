import { Menubar } from 'primereact/menubar';

export const MainLayout = ({children}) => {
  const items = [
    {
      label: 'Manage words',
      icon: 'pi pi-home',
      url: '/'

    },
    {
      label: 'Learn',
      icon: 'pi pi-star',
      url: "/lang-app/learn"
    },
  ];
  return (
    <main className="relative">
      <header className="w-full max-w-[1280px] mx-auto ">
        <Menubar model={items} />
      </header>
      <div className="px-3 py-2 w-full min-h-[100vh] max-w-[1280px] mx-auto">
        {children}
      </div>
    </main>
  )
}
