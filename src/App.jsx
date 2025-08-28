import {WordsListModule} from "./modules/words-list/index.jsx";
import {StoreProvider} from "./store/main.jsx";

function App() {

  return (
    <>
      <StoreProvider>
        <WordsListModule/>
      </StoreProvider>

    </>
  )
}

export default App
