import {MainLayout} from "../../components/layout/main-layout.jsx";
import {useStore, wordStatuses} from "../../store/main.jsx";
import {useState} from "react";
import {Card} from "./card/index.jsx";
import {Button} from "primereact/button";

export const showWords = {
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress',
}

export const LearnModule = () => {
  const [currentStatus, setStatus] = useState(showWords.inProgress)
  const onSetStatus = (s) => () => setStatus(s)

  const store = useStore()

  const renderWords = () => {
    if(currentStatus === showWords.inProgress) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.inProgress)
    }
    if(currentStatus === showWords.learned) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.unlearned)
    }
    if(currentStatus === showWords.unlearned) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.learned)
    }
    return []
  }

  console.log(store)

  return (
    <MainLayout>
      <div className="relative pt-2 w-full">
        <h2 className="text-xl">Learn words</h2>

        <div className="flex mt-3 flex-wrap">
          <div className="mr-3 mb-2">
            <Button size="small" onClick={onSetStatus(showWords.inProgress)}>Learning words</Button>
          </div>
          <div className="mr-3 mb-2">
            <Button size="small" onClick={onSetStatus(showWords.learned)}>Add new words</Button>
          </div>
          <div className="mr-3 mb-2">
            <Button size="small" onClick={onSetStatus(showWords.unlearned)}>Repeat learned words</Button>
          </div>
        </div>

        <div className="mx-[-5px] mt-3">
          <div className="flex flex-wrap">
            {!renderWords().length && (
              <h1 className="text-2xl text-center mx-auto">
                Empty words list
              </h1>
            )}
            {renderWords().map((w) => (
              <div key={w.id} className="p-[5px] lg:w-[20%] w-[50%]">
                <Card disableBlure={w.status !== wordStatuses.inProgress} onRemove={store.removeWord}
                      onLearn={store.markLearned} word={w}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
