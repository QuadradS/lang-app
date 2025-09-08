import { Menubar } from 'primereact/menubar';
import {Link} from "react-router";
import {Button} from "primereact/button";

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
      <header className="w-full max-w-[1280px] mx-auto px-3">
        <Link className="text-md" to="/">
          <Button severity="info" text>Manage words</Button>
        </Link>
        <Link className="text-md ml-4" to="/learn">
          <Button severity="info" text>Learn</Button>
        </Link>
        <Link className="text-md ml-4" to="/memory-texts">
          <Button severity="info" text>
            Memory texts
          </Button>
        </Link>
      </header>
      <div className="px-3 py-2 w-full min-h-[100vh] max-w-[1280px] mx-auto">
        {children}
      </div>
    </main>
  )
}
