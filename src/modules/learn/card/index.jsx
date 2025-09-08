import "./index.css";
import {useState} from "react";
import classNames from "classnames";
import {wordStatuses} from "../../../store/main.jsx";
import {Button} from "primereact/button";
import {Card as CardComponent} from "primereact/card";

const first = "FIRST"
const second = "SECOND"

export const Card = ({word, onLearn, disableBlure}) => {
  const [blurred, setBlurred] = useState(second)

  const [answerStatus, setAnswerStatus] = useState()

  const onToggleOffBlur = () => !disableBlure && setBlurred(blurred ? null : second)

  const status = classNames('w-[10px] h-[10px] rounded-[50%] absolute left-[10px] top-[10px]', {
    'bg-[tomato]': word.status === wordStatuses.unlearned,
    'bg-[#009688]': word.status === wordStatuses.learned,
    'bg-[#FFEB3B]': word.status === wordStatuses.inProgress,
  })

  const onCheckWord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const value = data.checkWord
      .toLowerCase()
      .split(',')
      .filter(Boolean);
    const _word = word.word.toLowerCase();
    const _wordTranslate = word.wordTranslate
      .toLowerCase()
      .split(',')
      .filter(Boolean)
      .map((v) => v.trim())

    if (blurred === first && !value.includes(_word)) {
      setAnswerStatus('incorrect')
      return
    }

    if (blurred === second && !value.some((v) => _wordTranslate.includes(v))) {
      setAnswerStatus('incorrect')
      return
    }

    setAnswerStatus('correct')
    setBlurred(false)
  }

  const Footer = () => {
    return (
      <>
        {word.status === wordStatuses.inProgress && (
          <Button className="w-full text-center block mt-1" size="small"
                  onClick={() => onLearn(word.id, wordStatuses.learned)} fullWidth>
            Mark as learned
          </Button>
        )}


        {word.status === wordStatuses.unlearned && (
          <Button className="w-full text-center block mt-1" size="small"
                  onClick={() => onLearn(word.id, wordStatuses.inProgress)} fullWidth>
            Start learn
          </Button>
        )}

        {word.status === wordStatuses.learned && (
          <Button className="w-full text-center block mt-1" size="small"
                  onClick={() => onLearn(word.id, wordStatuses.inProgress)} fullWidth>
            Repeat word
          </Button>
        )}
      </>
    )
  }


  return (
    <CardComponent footer={Footer} className="relative" title={word.word}>
      <div className={status}/>


      <div onClick={onToggleOffBlur} style={{filter: !disableBlure && `blur(${blurred === second ? 10 : 0}px)`}}
           className="w-full text-center text-md mb-2 blured text-ellipsis overflow-hidden"
           title={word.wordTranslate}>
        {word.wordTranslate}
      </div>

      <div className="h-[140px] overflow-hidden text-ellipsis">
        {!!word.example && (
          <p>{word.example}</p>
        )}
      </div>

      {/*{word.status === wordStatuses.inProgress && answerStatus !== 'correct' && (*/}
      {/*  <form onSubmit={onCheckWord} className="flex items-end">*/}
      {/*    <InputText name="checkWord" placeholder="Word"/>*/}
      {/*    <div className="ml-2">*/}
      {/*      <Button size="small" fullWidth disabled={answerStatus === 'correct'}>*/}
      {/*        {answerStatus === 'correct' && 'Correct'}*/}
      {/*        {answerStatus === 'incorrect' && 'Try again'}*/}
      {/*        {!answerStatus && 'Check'}*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*)}*/}


    </CardComponent>
  )
}
