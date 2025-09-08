import {Link} from "react-router";
import {Button} from "primereact/button";
import {useStore} from "../../store/main.jsx";
import {downloadJson} from "../../utils/dom.jsx";

export const MainLayout = ({children}) => {

  const store = useStore()

  const onExport = () => {
    const json = JSON.stringify(store.data || {})
    downloadJson(json)
  }
  return (
    <main className="relative">
      <header className="w-full max-w-[1280px] mx-auto px-3">
        <Link className="text-md sm:w-full sm:inline block" to="/">
          <Button size="small" severity="secondary" text>Manage words</Button>
        </Link>
        <Link className="text-md sm:w-full sm:inline block" to="/learn">
          <Button size="small" severity="secondary" text>Learn</Button>
        </Link>
        <Link className="text-md sm:w-full sm:inline block" to="/memory-texts">
          <Button size="small" severity="secondary" text>
            Memory texts
          </Button>
        </Link>
        <Button onClick={onExport} size="small" className="ml-auto sm:flex-inline block" severity="secondary"  icon="pi pi-file-arrow-up" label="Export data"/>
      </header>
      <div className="px-3 py-2 w-full min-h-[100vh] max-w-[1280px] mx-auto">
        {children}
      </div>
    </main>
  )
}
