import {MainLayout} from "../../components/layout/main-layout.jsx";
import {MemoryTextModal} from "./memory-text-modal/index.jsx";
import {useStore} from "../../store/main.jsx";
import {ViewMemoryTextModal} from "./view-memory-text-modal/index.jsx";
import {useState} from "react";
import {Popover} from "../../components/popover/index.jsx";

export const MemoryText = () => {
  const store = useStore()
  const [selected, setSelected] = useState(null)

  console.log(store)
  console.log(selected)
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
              <div
                className="w-full bg-white rounded-[2px] p-2 shadow-[0px_0px_3px_1px_#cdcdcd82] cursor-pointer relative ">

                <h2 className="text-xl">{t.title}</h2>

                <div className="my-2 w-full h-[1px] bg-[#dcdcdc] "/>

                <div className="text-sm flex flex-wrap h-[140px] overflow-hidden text-ellipsis content-start justify-start">
                  {t.text.split(' ').map((w) => (
                    <>
                      {t.usedWords[w] && (
                        <span className={`mx-1 mt-1 bg-black text-white px-1 rounded`}>{t.usedWords[w].wordTranslate}</span>
                      )}

                      {!t.usedWords[w] && (
                        <span className='mx-1 mt-1'>{w}</span>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
