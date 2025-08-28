import "./index.css";
import {useState} from "react";
import {Button} from "../../../components/button/index.jsx";
import classNames from "classnames";

const first = "FIRST"
const second = "SECOND"

export const Card = ({word, onRemove, onLearn}) => {
  const [blurred, setBlurred] = useState(second)

  const onToggleOffBlur = () => setBlurred(blurred ? null : second)

  const status = classNames('w-[20px] h-[20px] rounded-[50%]', {
    'bg-[tomato]': !word.learned,
    'bg-[#009688]': word.learned,
  })
  return (
    <div className="w-full bg-white rounded-[2px] p-2 shadow-[0px_0px_3px_1px_#cdcdcd82] cursor-pointer relative">
      <div className={status}/>

      <div onClick={onToggleOffBlur}>
        <div style={{filter: `blur(${blurred === first ? 10 : 0}px)`}}
             className="w-full text-center text-3xl mt-5 blured">
          {word.word}
        </div>
        <div className="w-full h-[1px] bg-[#dcdcdc] my-5"/>
        <div style={{filter: `blur(${blurred === second ? 10 : 0}px)`}}
             className="w-full text-center text-3xl mb-5 blured">
          {word.wordTranslate}
        </div>
      </div>
      <div>
        <div className="mt-2">
          <Button fullWidth onClick={() => onRemove(word.word)}>Remove</Button>
        </div>
        <div className="mt-2">
          <Button onClick={() => onLearn(word.word, !word.learned)} fullWidth>Mark as {word.learned ? 'learned' : 'unlearned'}</Button>
        </div>
      </div>
    </div>
  )
}
