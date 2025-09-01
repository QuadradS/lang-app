import {MainLayout} from "../../components/layout/main-layout.jsx";
import {Card} from "./card/index.jsx";
import {AddWordModal} from "./add-word-modal/index.jsx";
import {useStore, wordStatuses} from "../../store/main.jsx";
import {Button} from "../../components/button/index.jsx";
import {useState} from "react";

const showWords = {
  all: 'all',
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress'
}

export const WordsListModule = () => {
  const store = useStore();
  const [wordStatus, setWordStatus] = useState(showWords.all)
  const onSetWordStatus = (s) => () => setWordStatus(s)

  const renderWords = () => {
    if (wordStatus === showWords.all) {
      return Object.values(store.data.words)
    }

    return Object.values(store.data.words).filter(({status}) => status === wordStatus)
  }


  return (
    <MainLayout>
      <div className="relative pt-2 w-full">

        <h2 className="text-xl">Words list</h2>

        <div className="mt-3">
          <AddWordModal/>
        </div>

        <div className="flex mt-3">
          <div className="mr-3">
            <Button onClick={onSetWordStatus(showWords.all)}>All words</Button>
          </div>
          <div className="mr-3">
            <Button onClick={onSetWordStatus(showWords.unlearned)}>Unlearned</Button>
          </div>
          <div className="mr-3">
            <Button onClick={onSetWordStatus(showWords.learned)}>Learned</Button>
          </div>
        </div>

        <div className="mx-[-5px] mt-3 w-full">
          <div className="flex flex-wrap w-full">

            {!renderWords().length && (
              <h1 className="text-2xl text-center mx-auto">
                Empty words list
              </h1>
            )}
            {renderWords().map((w) => (
              <div key={w.id} className="p-[5px] lg:w-[20%] w-[50%]">
                <Card word={w}/>
              </div>
            ))}
          </div>

        </div>
      </div>
    </MainLayout>

  )
}
