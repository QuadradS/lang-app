import {WordsListModule} from "./modules/words-list/index.jsx";
import {StoreProvider} from "./store/main.jsx";
import {createBrowserRouter, RouterProvider} from "react-router";
import {LearnModule} from "./modules/learn/index.jsx";
import {MemoryText} from "./modules/memory-text/index.jsx";
import { PrimeReactProvider } from 'primereact/api';

let router = createBrowserRouter([
  {
    path: "/",
    Component: WordsListModule,
    loader: () => <div>Wait</div>,
  },
  {
    path: "/learn",
    Component: LearnModule,
    loader: () => <div>Wait</div>,
  },,
  {
    path: "/memory-texts",
    Component: MemoryText,
    loader: () => <div>Wait</div>,
  },
], {
  basename: '/lang-app',
});

function App() {

  return (
    <PrimeReactProvider>
      <StoreProvider>
        <RouterProvider router={router}/>,
      </StoreProvider>
    </PrimeReactProvider>
  )
}

export default App
