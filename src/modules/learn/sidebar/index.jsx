import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import classNames from "classnames";
import {wordStatuses} from "../../../store/main.jsx";
import {InputTextarea} from "primereact/inputtextarea";

export const WordSidebar = ({selectedWord, onClose, onLearn, onUpdate}) => {

  const status = classNames('w-[10px] h-[10px] rounded-[50%] absolute left-[10px] top-[10px]', {
    'bg-[tomato]': selectedWord?.status === wordStatuses.unlearned,
    'bg-[#009688]': selectedWord?.status === wordStatuses.learned,
    'bg-[#FFEB3B]': selectedWord?.status === wordStatuses.inProgress,
  })

  const onHandleLearn = () => {
    onLearn(selectedWord.id, wordStatuses.learned)
    onClose()
  }

  const onHandleAdd = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target);
    const {example} = Object.fromEntries(formData.entries());

    onUpdate({
      ...selectedWord,
      example: `${selectedWord.example }\n ${example}`
    })
  }

  return (
    <Sidebar visible={!!selectedWord} onHide={onClose}>
      <div className={status}/>

      <h2>
        {selectedWord?.word}
      </h2>
      <h3 className="font-normal">{selectedWord?.wordTranslate}</h3>
      <p style={{ whiteSpace: 'pre-line' }}>
        {selectedWord?.example}
      </p>

      <form onSubmit={onHandleAdd}>
        <InputTextarea className="w-full min-h-[140px]" name='example'/>
        <Button  className="w-full text-center block mt-1" size="small" fullWidth>
          Add
        </Button>
      </form>
      <Button className="w-full text-center block mt-1" size="small" onClick={onHandleLearn} fullWidth>
        Mark as learned
      </Button>
    </Sidebar>
  )
}
