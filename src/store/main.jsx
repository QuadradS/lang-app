import React, {createContext, useContext, useEffect, useState} from "react";
import {getMockedWords} from "./mock.js";

const StoreContext = createContext();
const localStorageKey = "LC_KEY"

export const wordStatuses = {
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress',
}

export const StoreProvider = ({children}) => {
  const [data, setData] = useState({
    words: []
  });

  const syncLocalStorage = (s) => {
    localStorage.setItem(localStorageKey, JSON.stringify(s))
  }

  const addWord = ({word, wordTranslate}) => {
    const newStore = {
      ...data,
      words: {
        ...data.words,
        [Object.keys(data.words).length]: {id: Object.keys(data.words).length, word, wordTranslate, status: wordStatuses.unlearned}
      }
    }
    setData(newStore)
    syncLocalStorage(newStore)
  }

  const removeWord = (wordId) => {
    delete data.words[wordId]
    setData({...data})
    syncLocalStorage({...data})
  }

  const markLearned = (wordId, s) => {
    if (data.words[wordId]?.status) {
      data.words[wordId].status = s
    }

    setData({...data})
    syncLocalStorage({...data})
  }

  const updateWord = (w) => {
    if (!data.words[w.id]) {
      return
    }

    data.words[w.id] = {
      ...data.words[w.wordId],
      ...w,
    }

    setData({...data})
    syncLocalStorage({...data})
  }


  useEffect(() => {
    const savedStorageStr = localStorage.getItem(localStorageKey);
    const storage = !!savedStorageStr && JSON.parse(savedStorageStr)

    if (storage) {
      setData(storage)
    }
  }, []);


  return (
    <StoreContext.Provider value={{data, addWord, removeWord, markLearned, updateWord}}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
