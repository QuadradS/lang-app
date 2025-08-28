import {MainLayout} from "../../components/layout/main-layout.jsx";
import {Card} from "./card/index.jsx";
import {AddWordModal} from "./add-word-modal/index.jsx";
import {useStore} from "../../store/main.jsx";

export const WordsListModule = () => {
  const store = useStore();

  return (
    <MainLayout>
      <div className="relative pt-2">

        <h2 className="text-xl">Words list</h2>

        <div className="mt-3">
          <AddWordModal/>
        </div>

        <div className="mx-[-5px] mt-3">
          <div className="flex flex-wrap">
            {store.data.words.map((w) => (
              <div key={w.word} className="p-[5px] lg:w-[25%] w-[50%]">
                <Card onRemove={store.removeWord} onLearn={store.markLearned} word={w}/>
              </div>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>

  )
}
