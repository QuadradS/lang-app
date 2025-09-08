import {MainLayout} from "../../components/layout/main-layout.jsx";
import {useStore, wordStatuses} from "../../store/main.jsx";
import {useState} from "react";
import {Card} from "./card/index.jsx";
import {Button} from "primereact/button";
import {TabMenu} from "primereact/tabmenu";
import classNames from "classnames";
import {Sidebar} from "primereact/sidebar";
import {WordSidebar} from "./sidebar/index.jsx";

export const showWords = {
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress',
}

export const LearnModule = () => {
  const [selectedWord, setSelectedWord] = useState(null)
  const [currentStatus, setStatus] = useState(showWords.inProgress)

  const store = useStore()

  const renderWords = () => {
    if (currentStatus === showWords.inProgress) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.inProgress)
    }
    if (currentStatus === showWords.learned) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.learned)
    }
    if (currentStatus === showWords.unlearned) {
      return Object.values(store.data.words).filter(({status}) => status === wordStatuses.unlearned)
    }
    return []
  }

  const getValue = (v) => {
    return classNames({
      'All': v === showWords.all,
      'In progress': v === showWords.inProgress,
      'Unleaned': v === showWords.unlearned,
      'Learned': v === showWords.learned,
    })
  }

  const items = Object.values(showWords).map((v) => ({
    label: getValue(v),
    command: () => setStatus(v)
  }))

  const onSelect = (w) => {
    setSelectedWord(w)
  }

  return (
    <MainLayout>
      <WordSidebar selectedWord={selectedWord} onClose={() => setSelectedWord(null)} onLearn={store.markLearned}/>
      <div className="relative pt-2 w-full">
        <h2 className="text-xl">Learn words</h2>

        {/*<div className="flex mt-3 flex-wrap">*/}
        {/*  <div className="mr-3 mb-2">*/}
        {/*    <Button size="small" onClick={onSetStatus(showWords.inProgress)}>Learning words</Button>*/}
        {/*  </div>*/}
        {/*  <div className="mr-3 mb-2">*/}
        {/*    <Button size="small" onClick={onSetStatus(showWords.learned)}>Add new words</Button>*/}
        {/*  </div>*/}
        {/*  <div className="mr-3 mb-2">*/}
        {/*    <Button size="small" onClick={onSetStatus(showWords.unlearned)}>Repeat learned words</Button>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="flex mt-3">
          <TabMenu activeIndex={2} model={items}/>
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
                <Card onClose={() => setSelectedWord(null)} onSelect={onSelect}
                      disableBlure={w.status !== wordStatuses.inProgress} onRemove={store.removeWord}
                      onLearn={store.markLearned} word={w}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
