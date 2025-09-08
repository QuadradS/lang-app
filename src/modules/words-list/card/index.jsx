import "./index.css";
import classNames from "classnames";
import {useStore, wordStatuses} from "../../../store/main.jsx";
import {useEffect, useState} from "react";
import {Card as CardComponent} from "primereact/card";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";


export const Card = ({word}) => {
  const [editMode, setEditMode] = useState(false)
  const [values, setValues] = useState({
    word: word.word,
    wordTranslate: word.wordTranslate
  })

  const store = useStore();

  useEffect(() => {
    setValues({
      word: word.word,
      wordTranslate: word.wordTranslate
    })
  }, [editMode]);

  const status = classNames('w-[10px] h-[10px] rounded-[50%] absolute left-[5px] top-[5px]', {
    'bg-[tomato]': word.status === wordStatuses.unlearned,
    'bg-[#009688]': word.status === wordStatuses.learned,
    'bg-[#FFEB3B]': word.status === wordStatuses.inProgress,
  })

  const onInput = (k) => (e) => setValues({...values, [k]: e.target.value})
  const onUpdate = (e) => {
    e.preventDefault()

    store.updateWord({
      ...word,
      ...values
    })

    setEditMode(false)
  }

  const footer = () => {
    return (
      <>
        {!editMode && (
          <div className="flex">
            <Button icon="pi pi-pencil" aria-label="Filter" className="mr-2" onClick={() => setEditMode(true)} />
            <Button icon="pi pi-trash" aria-label="Filter" severity="danger" onClick={() => store.removeWord(word.id)} />
          </div>
        )}
      </>
    )
  }

  return (
    <CardComponent footer={footer} title={word.word} subTitle={word.wordTranslate} className="relative">
      <div className={status}/>
      {editMode && (
        <form onSubmit={onUpdate}>
          <div className="mt-1">
            <InputText required onChange={onInput('word')} value={values.word}/>
          </div>
          <div className="mt-1">
            <InputText required onChange={onInput('wordTranslate')} value={values.wordTranslate}/>
          </div>

          <div className="flex mt-2">
            <Button icon="pi pi-check" aria-label="Filter"/>
            <Button icon="pi pi-times" className="ml-2" severity="danger" aria-label="Cancel"/>
          </div>
        </form>
      )}

    </CardComponent>
  )
}
