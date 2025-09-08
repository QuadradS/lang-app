import {WordsListModule} from "./modules/words-list/index.jsx";
import {StoreProvider} from "./store/main.jsx";
import {createHashRouter, RouterProvider} from "react-router";
import {LearnModule} from "./modules/learn/index.jsx";
import {MemoryText} from "./modules/memory-text/index.jsx";
import { PrimeReactProvider } from 'primereact/api';


const router = createHashRouter([
  { path: "/", Component: WordsListModule },
  { path: "/learn", Component: LearnModule },
  { path: "/memory-texts", Component: MemoryText },
]);

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
