import {Button} from "../../../components/button/index.jsx";
import {useState} from "react";
import {TextAreaField} from "../../../components/text-area/index.jsx";
import {useStore} from "../../../store/main.jsx";
import {TextInput} from "../../../components/text-input/index.jsx";

export const MemoryTextModal = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [usedWords, setUsedWords] = useState({});
  const setModalState = (s) => () => setState(s)

  const {data, addMemoryText} = useStore();

  if (!state) {
    return (
      <Button onClick={setModalState(true)}>Add new memory text</Button>
    )
  }

  const onCreateMemoryText = (e) => {
    e.preventDefault()

    addMemoryText({id: Object.values(data.memoryTexts || []).length, title, text: value, usedWords})
    setState(false)
  }

  const onChooseWord = (w) => () => {
    setUsedWords({...usedWords, [w.word]: w})

    setValue(`${value} ${w.word}`)
  }


  return (
    <>
      <Button onClick={setModalState(false)}>Close</Button>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="p-4 w-full">
          <div className="max-w-[1000px] bg-[#f6f6fa] rounded relative z-10 p-4 w-full mx-auto max-h-[90vh]">
            <h1 className="text-2xl">Add new memory text</h1>

            <form className="mt-2" onSubmit={onCreateMemoryText}>
              <TextInput label='memory text title' value={title} onChange={(e) => setTitle(e.target.value)} required/>
              <TextAreaField value={value} onChange={(e) => setValue(e.target.value)} name="memoryText" required
                             rows={5} label="Memory text"/>

              <div>
                <h2>Add word:</h2>

                <div className="flex flex-wrap max-h-[100px] overflow-y-auto overflow-x-hidden">
                  {Object.values(data.words).map((v) => (
                    <div key={v.id} className="mt-1 ml-1">
                      <button onClick={onChooseWord(v)} type="button"
                              className="cursor-pointer bg-transparent px-2 py-0 rounded-lg border-[1px] border-[#0035f6] text-[#0035f6]">{v.word}</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <Button>Submit</Button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </>
  )
}
