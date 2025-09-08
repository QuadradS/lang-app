import {Popover} from "../../../components/popover/index.jsx";
import {Tag} from "primereact/tag";

export const ViewMemoryTextModal = ({isOpen, onClose, memoryText}) => {

  if (!isOpen) {
    return null
  }

  console.log(memoryText)

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
      <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={onClose}/>

      <div className="py-2 px-4 w-full">
        <div className="max-w-[1000px] bg-[#f6f6fa] rounded relative z-10 p-4 w-full mx-auto max-h-[90vh]">
          <h1 className="text-2xl mt-0">{memoryText.title}</h1>
          <div>
            <div className="text-sm flex flex-wrap min-h-[140px] content-start justify-start">
              {memoryText.text.split(' ').map((w) => (
                <>
                  {memoryText.usedWords[w] && (
                    <Popover popoverText={memoryText.usedWords[w].wordTranslate}>
                      <Tag className='logo' tooltip={w}>{w}</Tag>
                    </Popover>
                  )}
                  {!memoryText.usedWords[w] && (
                    <span className='mx-1 mt-1'>{w}</span>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
