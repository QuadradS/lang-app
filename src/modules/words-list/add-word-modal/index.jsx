import {useState} from "react";
import {Button} from "../../../components/button/index.jsx";
import {TextInput} from "../../../components/text-input/index.jsx";
import {useStore} from "../../../store/main.jsx";

export const AddWordModal = () => {
  const [state, setState] = useState(false);
  const store = useStore();
  const setModalState = (s) => () => setState(s)

  if (!state) {
    return (
      <Button onClick={setModalState(true)}>Add new word</Button>
    )
  }

  const onSave = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.word && data.wordTranslate) {
      store.addWord({
        word: data.word,
        wordTranslate: data.wordTranslate
      })
    }

    setState(false)
  }

  return (
    <>
      <Button onClick={setModalState(false)}>Close</Button>

      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="w-[500px] h-[500px] bg-[#f6f6fa] rounded relative z-10 p-4">
          <h1 className="text-2xl">Add new word</h1>

          <form onSubmit={onSave} className="w-full">
            <div className="mt-2">
              <TextInput name={'word'} required label="Word"/>
            </div>

            <div className="mt-2">
              <TextInput name={'wordTranslate'} required label="Word translate"/>
            </div>

            <div className="mt-2">
              <Button fullWidth>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )

}
