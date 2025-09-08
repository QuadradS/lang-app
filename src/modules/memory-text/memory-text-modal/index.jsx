import {useState} from "react";
import {useStore} from "../../../store/main.jsx";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Tag} from "primereact/tag";
import {InputTextarea} from "primereact/inputtextarea";
// import {Editor} from "primereact/editor";

export const MemoryTextModal = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [usedWords, setUsedWords] = useState({});
  const setModalState = (s) => () => setState(s)

  const {data, addMemoryText} = useStore();

  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Add new memory text</Button>
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
      <Button size="small" onClick={setModalState(false)}>Close</Button>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="p-4 w-full">
          <div className="max-w-[1000px] bg-[#f6f6fa] rounded relative z-10 p-4 w-full mx-auto max-h-[90vh]">
            <h1 className="text-2xl">Add new memory text</h1>

            <form className="mt-2" onSubmit={onCreateMemoryText}>
              <InputText className="w-full" placeholder='memory text title' value={title} onChange={(e) => setTitle(e.target.value)}
                         required/>
              <InputTextarea className="w-full mt-2" value={value} onChange={(e) => setValue(e.target.value)} name="memoryText" required
                             rows={5} placeholder="Memory text"/>

              {/*<Editor className="w-full mt-2" value={value} onTextChange={(e) => setValue(e.htmlValue)} style={{ minHeight: '140px' }} />*/}


              <div>
                <h2 className="mb-0">Add word:</h2>

                <div className="flex flex-wrap max-h-[100px] overflow-y-auto overflow-x-hidden">
                  {Object.values(data.words).map((v) => (
                    <div key={v.id} className="mt-1 ml-1">
                      <Tag onClick={onChooseWord(v)} severity="info" className="cursor-pointer">{v.word}</Tag>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <Button size="small">Submit</Button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </>
  )
}
