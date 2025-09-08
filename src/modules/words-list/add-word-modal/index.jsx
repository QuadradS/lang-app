import {useState} from "react";
import {useStore} from "../../../store/main.jsx";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";

export const AddWordModal = () => {
  const [state, setState] = useState(false);
  const store = useStore();
  const setModalState = (s) => () => setState(s)

  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Add new word</Button>
    )
  }

  const onSave = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.word && data.wordTranslate) {
      store.addWord({
        id: Object.values(store.data?.words || {}).length,
        word: data.word,
        wordTranslate: data.wordTranslate,
        example: data.example,
      })
    }

    setState(false)
  }

  return (
    <>
      <Button onClick={setModalState(false)}>Close</Button>

      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="p-4 w-full">
          <div className="max-w-[500px] bg-[#f6f6fa] rounded relative z-10 p-4 py-2 w-full mx-auto">
            <h1 className="text-2xl mt-2">Add new word</h1>

            <form onSubmit={onSave} className="w-full flex flex-wrap flex-col">
              <InputText placeholder="Word" className="w-full mt-2" name={'word'} required label="Word"/>
              <InputText placeholder="Word translate" className="w-full mt-2" name={'wordTranslate'} required label="Word translate"/>
              <InputTextarea placeholder="Example" className="mt-2 w-full" name={'example'}/>
              <div className="mt-6 w-full">
                <Button size="small">Save</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )

}
