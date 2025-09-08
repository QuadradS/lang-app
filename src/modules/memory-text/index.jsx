import {MainLayout} from "../../components/layout/main-layout.jsx";
import {MemoryTextModal} from "./memory-text-modal/index.jsx";
import {useStore} from "../../store/main.jsx";
import {ViewMemoryTextModal} from "./view-memory-text-modal/index.jsx";
import {useState} from "react";
import {Card} from "primereact/card";
import {Chip} from "primereact/chip";
import {Tag} from "primereact/tag";
import {Tooltip} from "primereact/tooltip";

export const MemoryText = () => {
  const store = useStore()
  const [selected, setSelected] = useState(null)

  return (

    <MainLayout>

      <div className="relative pt-2 w-full">
        <h2 className="text-xl">Memory texts</h2>
      </div>

      <div className="mt-3">
        <MemoryTextModal/>
      </div>


      <div className="mx-[-5px] mt-3">
        <div className="flex flex-wrap">

          <ViewMemoryTextModal isOpen={!!selected} memoryText={selected} onClose={() => setSelected(false)}/>


          {Object.values(store.data.memoryTexts || {}).map((t) => (
            <div key={t.id} className="p-[5px] lg:w-[20%] w-[50%]" onClick={() => setSelected(t)}>
              <Card
                title={t.title}
                className="w-full relative ">
                <div className="text-sm flex flex-wrap h-[140px] overflow-hidden text-ellipsis content-start justify-start">
                  {t.text.split(' ').map((w) => (
                    <>
                      {t.usedWords[w] && (
                        <Tag value={t.usedWords[w].wordTranslate}/>
                      )}

                      {!t.usedWords[w] && (
                        <span className='mx-1 mt-1'>{w}</span>
                      )}
                    </>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
