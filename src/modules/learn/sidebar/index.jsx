import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import classNames from "classnames";
import {wordStatuses} from "../../../store/main.jsx";

export const WordSidebar = ({selectedWord, onClose, onLearn}) => {

  const status = classNames('w-[10px] h-[10px] rounded-[50%] absolute left-[10px] top-[10px]', {
    'bg-[tomato]': selectedWord?.status === wordStatuses.unlearned,
    'bg-[#009688]': selectedWord?.status === wordStatuses.learned,
    'bg-[#FFEB3B]': selectedWord?.status === wordStatuses.inProgress,
  })

  const onHandleLearn = () => {
    onLearn(selectedWord.id, wordStatuses.learned)
    onClose()
  }

  return (
    <Sidebar visible={!!selectedWord} onHide={onClose}>
      <div className={status}/>

      <h2>
        {selectedWord?.word}
      </h2>
      <h3 className="font-normal">{selectedWord?.wordTranslate}</h3>
      <p>
        {selectedWord?.example}
      </p>

      <Button className="w-full text-center block mt-1" size="small" onClick={onHandleLearn} fullWidth>
        Mark as learned
      </Button>
    </Sidebar>
  )
}
