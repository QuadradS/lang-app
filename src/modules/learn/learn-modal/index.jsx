import {Button} from "primereact/button";
import {useEffect, useRef, useState} from "react";
import {Card} from "primereact/card";
import {useStore, wordStatuses} from "../../../store/main.jsx";
import {shuffleArray} from "../../../utils/data.js";
import {InputText} from "primereact/inputtext";

export const LearnModal = () => {
  const [state, setState] = useState(false);
  const [indexesArray, setArray] = useState([0]);
  const [answerStatus, setStatus] = useState('init');
  const [selectedIndex, setIndex] = useState(0);
  const setModalState = (s) => () => setState(s)
  const store = useStore()
  const nextButtonRef = useRef(null)

  const learningWords = Object.values(store.data.words).filter(({status}) => status === wordStatuses.inProgress)

  useEffect(() => {
    const acc = []

    for (let i = 0; i < learningWords.length; i++) {
      acc.push(i)
    }

    setArray(shuffleArray(acc))
  }, [state]);

  if (!state) {
    return (
      <Button size="small" onClick={setModalState(true)}>Start learning</Button>
    )
  }

  const currentWord = learningWords[indexesArray[selectedIndex]]


  const onCheckWord = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const value = data.checkWord
      .toLowerCase()
      .split(',')
      .filter(Boolean);

    const _wordTranslate = currentWord.wordTranslate
      .toLowerCase()
      .split(',')
      .filter(Boolean)
      .map((v) => v.trim())

    if (!value.some((v) => _wordTranslate.includes(v))) {
      setStatus('incorrect')
      return
    }

    setStatus('correct')
    // setBlurred(false)
  }

  const onNextWord = () => {
    if (selectedIndex === indexesArray.length - 1) {
      setStatus('finished')
      return
    }
    setIndex(selectedIndex + 1)
    setStatus('init')
    nextButtonRef?.current?.focus();
  }

  if (!currentWord) {
    return null
  }

  console.log('nextButtonRef ', nextButtonRef)

  return (
    <>
      <Button size="small" onClick={setModalState(false)}>Close</Button>
      <div className="fixed left-0 right-0 top-0 bottom-0 z-20 flex items-center justify-center bg-[#00000045]">
        <div className="absolute cursor-pointer z-9 left-0 right-0 top-0 bottom-0" onClick={setModalState(false)}/>

        <div className="p-4 w-full">
          <div className="max-w-[500px] relative z-10 p-4 w-full mx-auto max-h-[90vh]">

            {answerStatus === 'finished' && (
              <Card>
                <h1 className="text-center">That is for today!</h1>
                <Button className="block text-center w-full max-w-[240px] mx-auto"
                        onClick={() => setState(false)}>Close</Button>
              </Card>
            )}

            {answerStatus !== 'finished' && (
              <Card title={currentWord.word}>
                <p className='text-center my-0'>{currentWord.example}</p>

                {answerStatus === 'incorrect' && (
                  <p className='text-center my-0 mt-2'>Try again! or <span onClick={() => setStatus('correct')}
                                                                           className="text-[#05b7d5] cursor-pointer">show the translate</span>
                  </p>
                )}

                {(answerStatus === 'init' || answerStatus === 'incorrect') && (
                  <p
                    className={"text-5xl my-0 text-center mt-0"}>{currentWord.wordTranslate.split('').map(() => ' _')}</p>
                )}

                {answerStatus === 'correct' && (
                  <p className={"text-4xl my-0 text-center mt-3"}>{currentWord.wordTranslate}</p>
                )}

                {answerStatus !== 'correct' && (
                  <form onSubmit={onCheckWord}>
                    <InputText name={'checkWord'} className='mx-auto block mt-4 w-full max-w-[220px]'
                               placeholder='Word'/>
                    <Button size="small" className="mx-auto block mt-2 w-full max-w-[220px]">Submit</Button>
                  </form>
                )}

                <Button
                  visible={answerStatus === 'correct'}
                  ref={nextButtonRef}
                  size="small"
                  className="mx-auto block mt-4 w-full max-w-[220px]"
                  onClick={onNextWord}>Next</Button>

              </Card>
            )}
          </div>


        </div>
      </div>
    </>
  )
}
