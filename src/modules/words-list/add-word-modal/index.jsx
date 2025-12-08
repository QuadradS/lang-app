import {useEffect, useState} from "react";
import {useStore, wordStatuses} from "../../../store/main.jsx";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import Editor from 'react-simple-wysiwyg';
import {Dropdown} from "primereact/dropdown";

export const AddWordModal = ({selectedWordId, onClose}) => {
  const [state, setState] = useState(false);
  const store = useStore();

  const [wordExample, setWordExample] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const selectedWord = store.data.words[selectedWordId];

    if (selectedWord) {
      setState(true)
      setWordExample(selectedWord.example)
    }

  }, [selectedWordId]);
  const setModalState = (s) => () => {
    if (!s) {
      onClose && onClose()
    }
    setState(s)
    setWordExample('')
  }
  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Add new word</Button>
    )
  }

  const onSave = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const wordId = selectedWordId || Object.values(store.data?.words || {}).length
    const newWord = {
      id: wordId,
      word: data.word,
      wordTranslate: data.wordTranslate,
      example: wordExample,
      status: wordStatuses.unlearned,
    }

    if (!data.word || !data.wordTranslate) {
      return
    }

    if (selectedWordId) {
      store.updateWord(newWord)
    } else {
      store.addWord(newWord, selectedGroup?.code)
    }


    setState(false)
    onClose && onClose()
  }


  function onChange(e) {
    setWordExample(e.target.value);
  }

  const items = Object.values(store.data.groups || {}).map(({id, name}) => ({name, code: id}))

  return (
    <>
      <Button onClick={setModalState(false)}>Close</Button>

      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="p-4 w-full">
          <div
            className="max-w-[900px] bg-[#f6f6fa] rounded relative z-10 p-4 py-2 w-full mx-auto max-h-[90vh] overflow-y-auto">
            <h1 className="text-2xl mt-2">Add new word</h1>

            <form onSubmit={onSave}>
              <InputText placeholder="Word" className="w-full mt-2" name={'word'} required label="Word"/>
              <InputText placeholder="Words transalate" className="w-full mt-2" name={'wordTranslate'} required
                         label="Word's transalate"/>
              <Dropdown
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.value)}
                options={items}
                optionLabel="name"
                placeholder="Select a group"
                className="w-full mt-2"
              />

              <div className="w-full mt-2">
                <Editor className="bg-[#fff] min-h-[150px]" value={wordExample} onChange={onChange}/>
              </div>
              <Button size="small" className="mt-2">Save</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )

}
