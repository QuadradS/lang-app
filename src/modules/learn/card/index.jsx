import "./index.css";
import {useState} from "react";
import classNames from "classnames";
import {TextInput} from "../../../components/text-input/index.jsx";
import {wordStatuses} from "../../../store/main.jsx";
import {Button} from "../../../components/button/index.jsx";

const first = "FIRST"
const second = "SECOND"

export const Card = ({word, onLearn, disableBlure}) => {
  const random = Math.round(Math.random() * 10)
  const [blurred, setBlurred] = useState(random < 5 ? first : second)

  const [answerStatus, setAnswerStatus] = useState()

  const onToggleOffBlur = () => !disableBlure && setBlurred(blurred ? null : second)

  const status = classNames('w-[20px] h-[20px] rounded-[50%]', {
    'bg-[tomato]': word.status === wordStatuses.unlearned,
    'bg-[#009688]': word.status === wordStatuses.learned,
    'bg-[#FFEB3B]': word.status === wordStatuses.inProgress,
  })

  const onCheckWord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const value = data.checkWord.toLowerCase();
    const _word = word.word.toLowerCase();
    const _wordTranslate = word.wordTranslate.toLowerCase();

    if (value !== _word && value !== _wordTranslate) {
      setAnswerStatus('incorrect')
      return
    }

    setAnswerStatus('correct')
    setBlurred(false)
  }


  return (
    <div className="w-full bg-white rounded-[2px] p-2 shadow-[0px_0px_3px_1px_#cdcdcd82] cursor-pointer relative">
      <div className={status}/>

      <div onClick={onToggleOffBlur}>
        <div style={{filter: !disableBlure && `blur(${blurred === first ? 10 : 0}px)`}}
             className="w-full text-center text-3xl mt-5 blured">
          {word.word}
        </div>
        <div className="w-full h-[1px] bg-[#dcdcdc] my-5"/>
        <div style={{filter: !disableBlure && `blur(${blurred === second ? 10 : 0}px)`}}
             className="w-full text-center text-3xl mb-5 blured">
          {word.wordTranslate}
        </div>
      </div>

      {word.status === wordStatuses.inProgress && (
        <form onSubmit={onCheckWord}>
          <TextInput name="checkWord" label="Enter word"/>
          <div className="mt-2">
            <Button fullWidth disabled={answerStatus === 'correct'}>
              {answerStatus === 'correct' && 'Correct'}
              {answerStatus === 'incorrect' && 'Try again'}
              {!answerStatus && 'Check'}
            </Button>
          </div>
          <div className="mt-2">
            <Button disabled={answerStatus !== 'correct'} onClick={() => onLearn(word.id, wordStatuses.learned)} fullWidth>Mark as learned</Button>
          </div>
        </form>
      )}

      {word.status === wordStatuses.unlearned && (
        <div>
          <div className="mt-2">
            <Button onClick={() => onLearn(word.id, wordStatuses.inProgress)} fullWidth>Start learn</Button>
          </div>
        </div>
      )}

      {word.status === wordStatuses.learned && (
        <div>
          <div className="mt-2">
            <Button onClick={() => onLearn(word.id, wordStatuses.inProgress)} fullWidth>Repeat word</Button>
          </div>
        </div>
      )}

    </div>
  )
}
