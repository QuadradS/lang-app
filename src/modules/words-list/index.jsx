import {MainLayout} from "../../components/layout/main-layout.jsx";
import {AddWordModal} from "./add-word-modal/index.jsx";
import {useStore} from "../../store/main.jsx";
import {useState} from "react";
import {WordsTable} from "./words-table/index.jsx";
import {TabMenu} from "primereact/tabmenu";
import classNames from "classnames";

const showWords = {
  all: 'all',
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress'
}

export const WordsListModule = () => {
  const store = useStore();
  const [wordStatus, setWordStatus] = useState(showWords.all)

  const renderWords = () => {
    if (wordStatus === showWords.all) {
      return Object.values(store.data.words)
    }

    return Object.values(store.data.words).filter(({status}) => status === wordStatus)
  }

  const getValue = (v) => {
    return classNames({
      'All': v === showWords.all,
      'Unleaned': v === showWords.unlearned,
      'Learned': v === showWords.learned,
      'In progress': v === showWords.inProgress,
    })
  }

  const items = Object.values(showWords).map((v) => ({
    label: getValue(v),
    command: () => setWordStatus(v)
  }))

  return (
    <MainLayout>
      <div className="relative pt-2 w-full">

        <h2 className="text-xl">Words list</h2>

        <div className="mt-3">
          <AddWordModal/>
        </div>

        <div className="flex mt-3">
          <TabMenu model={items}/>
        </div>

        <div className="my-3">
          <WordsTable words={renderWords()} onUpdateWord={store.updateWord}/>
        </div>

        {/*<div className="mx-[-5px] mt-3 w-full">*/}
        {/*  <div className="flex flex-wrap w-full">*/}

        {/*    {!renderWords().length && (*/}
        {/*      <h1 className="text-2xl text-center mx-auto">*/}
        {/*        Empty words list*/}
        {/*      </h1>*/}
        {/*    )}*/}
        {/*    {renderWords().map((w) => (*/}
        {/*      <div key={w.id} className="p-[5px] lg:w-[20%] w-[50%]">*/}
        {/*        <Card word={w}/>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}

        {/*</div>*/}
      </div>
    </MainLayout>

  )
}
