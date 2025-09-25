import {useState} from "react";
import {useStore, wordStatuses as showWords, wordStatuses} from "../../../store/main.jsx";
import classNames from "classnames";
import {MainLayout} from "../../../components/layout/main-layout.jsx";
import {WordSidebar} from "../sidebar/index.jsx";
import {TabMenu} from "primereact/tabmenu";
import {LearnModal} from "../learn-modal/index.jsx";
import {Card} from "../card/index.jsx";
import {useParams} from "react-router";

export const WordsList = () => {
  const [selectedWord, setSelectedWord] = useState(null)
  const [currentStatus, setStatus] = useState(showWords.inProgress)

  const store = useStore()
  const {groupId} = useParams()
  console.log(store.data.groups)

  const words = store.data.groups[groupId].words

  const renderWords = () => {
    if (currentStatus === showWords.inProgress) {
      return Object.values(words).filter(({status}) => status === wordStatuses.inProgress)
    }
    if (currentStatus === showWords.learned) {
      return Object.values(words).filter(({status}) => status === wordStatuses.learned)
    }
    if (currentStatus === showWords.unlearned) {
      return Object.values(words).filter(({status}) => status === wordStatuses.unlearned)
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

  const onUpdate = (w) => {
    store.updateWord(w)
    setSelectedWord({...w})
  }

  return (
    <MainLayout>
      <WordSidebar
        onUpdate={onUpdate}
        selectedWord={selectedWord}
        onClose={() => setSelectedWord(null)}
        onLearn={store.markLearned}
      />
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

        {currentStatus  === showWords.inProgress && (
          <div className="mt-3">
            <LearnModal/>
          </div>
        )}

        <div className="mx-[-5px] mt-3">
          <div className="flex flex-wrap">
            {!renderWords().length && (
              <h1 className="text-2xl text-center mx-auto">
                Empty words list
              </h1>
            )}
            {renderWords().map((w) => (
              <div key={w.id} className="p-[5px] lg:w-[20%] w-[50%]">
                <Card
                  onClose={() => setSelectedWord(null)} onSelect={onSelect}
                  onLearn={store.markLearned} word={w}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
