import React, {createContext, useContext, useEffect, useState} from "react";

const StoreContext = createContext();
const localStorageKey = "LC_KEY"

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
      words: [...data.words, {word, wordTranslate, learned: false}]
    }
    setData(newStore)
    syncLocalStorage(newStore)
  }

  const removeWord = (w) => {
    const newStore = {
      ...data,
      words: data.words.filter(({word, wordTranslate}) => word !== w && wordTranslate !== w)
    }

    setData(newStore)

    syncLocalStorage(newStore)
  }

  const markLearned = (w, learned) => {
    const word = data.words.find((word) => word.word === w)
    if (!word) {
      return
    }

    word.learned = learned
    const filtered = data.words.filter(({word, wordTranslate}) => word !== w && wordTranslate !== w);

    const newStore = {
      ...data,
      words: [...filtered, word]
    }

    console.log(newStore)

    setData(newStore)

    syncLocalStorage(newStore)
  }

  useEffect(() => {
    const savedStorageStr = localStorage.getItem(localStorageKey);
    const storage = !!savedStorageStr && JSON.parse(savedStorageStr)

    if (storage) {
      setData(storage)
    }
  }, []);


  return (
    <StoreContext.Provider value={{data, addWord, removeWord, markLearned}}>
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
