import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {useStore} from "../../../store/main.jsx";
import {Tag} from "primereact/tag";

export const CreateGroupModal = () => {
  const [state, setState] = useState(false);
  const setModalState = (s) => () => setState(s)

  const [selectedWords, setWords] = useState({})
  const store = useStore()

  console.log('selectedWords ', selectedWords)

  useEffect(() => {
    setWords({})
  }, [state]);

  const onSelect = (w) => () => {
    if (selectedWords[w.id]) {
      delete selectedWords[w]
      setWords({...selectedWords})
    } else {
      setWords({
        ...selectedWords,
        [w.id]: w
      })
    }
  }

  const onCreateGroup = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('data ', data)


    store.createGroup({
      id: Object.values(store.data.groups).length || 0,
      name: data.groupName,
      words: selectedWords
    })
  }


  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Create group</Button>
    )
  }

  return (
    <>
      <Button size="small" onClick={setModalState(false)}>Close</Button>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <form onSubmit={onCreateGroup} className="p-4 w-full">
          <div className="max-w-[500px] relative z-10 p-4 w-full mx-auto max-h-[90vh]">
            <Card title="Create group">
              <InputText placeholder='Group name' name='groupName' className="w-full"/>
              <div className="mt-2 w-full">
                <p className='m-0'>Words</p>
                <div className="w-full max-h-[150px] overflow-y-auto">
                  {Object.values(store.data.words).map((w) => (
                    <Tag onClick={onSelect(w)} severity={selectedWords[w.id] ? "success" : "info"}
                         className="mr-1 cursor-pointer" key={w.id} title='Words'>{w.word}</Tag>
                  ))}
                </div>

              </div>
              <Button size="small" className="block mt-3">Create</Button>
            </Card>
          </div>


        </form>
      </div>
    </>
  )
}
