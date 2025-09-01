import {WordsListModule} from "./modules/words-list/index.jsx";
import {StoreProvider} from "./store/main.jsx";
import {createBrowserRouter, RouterProvider} from "react-router";
import {LearnModule} from "./modules/learn/index.jsx";

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
  },
], {
  basename: '/lang-app',
});

function App() {

  return (
    <>
      <StoreProvider>
        <RouterProvider router={router}/>,
      </StoreProvider>
    </>
  )
}

export default App
