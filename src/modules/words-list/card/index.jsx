import "./index.css";
import {Button} from "../../../components/button/index.jsx";
import classNames from "classnames";
import {useStore, wordStatuses} from "../../../store/main.jsx";
import {useEffect, useState} from "react";
import {TextInput} from "../../../components/text-input/index.jsx";


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

  const status = classNames('w-[20px] h-[20px] rounded-[50%]', {
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

  return (
    <div className="w-full bg-white rounded-[2px] p-2 shadow-[0px_0px_3px_1px_#cdcdcd82] cursor-pointer relative">
      <div className={status}/>

      <div className="flex-col flex justify-between min-h-[230px]">
        {!editMode && (
          <>
            <div>
              <div className="w-full text-center text-3xl mt-5 blured text-ellipsis overflow-hidden" title={word.word}>
                {word.word}
              </div>
              <div className="w-full h-[1px] bg-[#dcdcdc] my-5"/>
              <div className="w-full text-center text-3xl mb-5 blured text-ellipsis overflow-hidden" title={word.wordTranslate}>
                {word.wordTranslate}
              </div>
            </div>
            <div>
              <div className="mt-2">
                <Button fullWidth onClick={() => store.removeWord(word.id)}>Remove</Button>
              </div>
              <div className="mt-2">
                <Button onClick={() => setEditMode(true)} fullWidth>Edit</Button>
              </div>
            </div>
          </>
        )}

        {editMode && (
          <>
            <form className="mt-3" onSubmit={onUpdate}>
              <div className="mt-2">
                <TextInput required onChange={onInput('word')} value={values.word}/>
              </div>
              <div className="mt-4">
                <TextInput required onChange={onInput('wordTranslate')} value={values.wordTranslate}/>
              </div>

              <div className="flex justify-between mt-[103px]">
                <div className="w-[49%]">
                  <Button type={'submit'} fullWidth>Apply</Button>
                </div>
                <div className="w-[49%]">
                  <Button type="button" fullWidth onClick={() => setEditMode(false)}>Cancel</Button>
                </div>
              </div>
            </form>

          </>
        )}
      </div>

    </div>
  )
}
