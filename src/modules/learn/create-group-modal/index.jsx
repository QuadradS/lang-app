import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {useStore} from "../../../store/main.jsx";
import {VirtualScroller} from 'primereact/virtualscroller';
import {RadioButton} from "primereact/radiobutton";
import {Panel} from "primereact/panel";
import {Divider} from "primereact/divider";

export const CreateGroupModal = ({groupId, onClose}) => {
  const [state, setState] = useState(false);
  const [selectedWords, setWords] = useState({})
  const [groupName, setGroupName] = useState('')

  const setModalState = (s) => () => {
    if (!s && onClose) {
      onClose()
    }
    setState(s)
  }
  const store = useStore()

  useEffect(() => {
    if (!state) {
      setWords({})
      setGroupName('')
      onClose && onClose()
    }
  }, [state]);

  useEffect(() => {
    const group = store.data.groups[groupId]

    if (group) {
      const groupWords = Object.values(group.words).reduce((acc, item) => {
        if (store.data.words[item]) {
          acc[item] = store.data.words[item]
        }
        return acc
      }, {})

      setGroupName(group.name)
      setWords(groupWords || {})
      setState(true)
    }
  }, [groupId]);

  const onSelect = (w) => () => {
    if (selectedWords[w.id]) {
      delete selectedWords[w.id]
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
    const selectedWordsIds = Object.values(selectedWords).map(({id}) => id).reduce((acc, item) => {
      acc[item] = item
      return acc
    }, {})
    const group = store.data.groups[groupId]

    if (group) {
      store.updateGroup({
        id: group.id,
        name: data.groupName,
        words: selectedWordsIds
      })
    } else {
      store.createGroup({
        id: Object.values(store.data.groups).length || 0,
        name: data.groupName,
        words: selectedWordsIds
      })
    }

    setState(false)

  }


  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Create group</Button>
    )
  }

  const itemTemplate = (item) => {
    return (
      <>
        <div key={item.id} className="flex align-items-center cursor-pointer" onClick={onSelect(item)}>
          <RadioButton name="category" value={item.id} checked={!!selectedWords[item.id]}/>
          <label htmlFor={item.id} className="ml-1 cursor-pointer text-sm ">{item.word} - {item.wordTranslate}</label>
        </div>
        <Divider/>
      </>
    );
  };

  return (
    <>
      <Button size="small" onClick={setModalState(false)}>Close</Button>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <form onSubmit={onCreateGroup} className="p-4 w-full">
          <Panel header="Group options" className="max-w-[500px] relative z-10 p-4 w-full mx-auto">
            <InputText
              required value={groupName} placeholder='Group name' name='groupName' className="w-full"
              onChange={(e) => setGroupName(e.target.value)}
            />

            <p className='m-0 font-bold mt-5 mb-4'>Words</p>
            <VirtualScroller
              items={Object.values(store.data.words)} itemSize={50} itemTemplate={itemTemplate}
              className="w-full"
              style={{height: '200px'}}
            />
            <Button size="small" className="block mt-3">Submit</Button>
          </Panel>
        </form>
      </div>
    </>
  )
}
