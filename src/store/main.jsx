import React, {createContext, useContext, useEffect, useState} from "react";

const StoreContext = createContext();
export const localStorageKey = "LC_KEY"

export const wordStatuses = {
  learned: 'learned',
  unlearned: 'unlearned',
  inProgress: 'inProgress',
}

export const StoreProvider = ({children}) => {
  const [data, setData] = useState({
    words: {},
    memoryTexts: {},
    groups: {}
  });

  const syncLocalStorage = (s) => {
    localStorage.setItem(localStorageKey, JSON.stringify(s))
  }

  const setStore = (s) => {
    setData(s)
    syncLocalStorage(s)
  }

  const addMemoryText = (memoryText) => {
    const newStore = {
      ...data,
      memoryTexts: {
        ...data.memoryTexts,
        [memoryText.id]: memoryText
      }
    }
    setData(newStore)
    syncLocalStorage(newStore)
  }

  const createGroup = (group) => {
    const updatedData = {
      ...data,
      groups: {
        ...data.groups,
        [group.id]: group
      }
    }

    setData(updatedData)
    syncLocalStorage(updatedData)
  }

  const updateGroup = (group) => {
    const updatedData = {
      ...data,
      groups: {
        ...data.groups,
        [group.id]: group
      }
    }

    setData(updatedData)
    syncLocalStorage(updatedData)
  }

  const addWord = (word, groupId) => {
    const updatedData = {
      ...data,
      words: {
        ...data.words,
        [word.id]: word
      },
    }

    const groupToUpdate = data.groups[groupId]

    if (groupToUpdate) {
      updatedData.groups = {
        ...updatedData.groups,
        [groupId]: {
          ...groupToUpdate,
          words: {
            ...groupToUpdate.words,
            [word.id]: word.id,
          }
        }
      }
    }

    setData(updatedData)
    syncLocalStorage(updatedData)
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
      setData({...data, ...storage})
    }
  }, []);


  return (
    <StoreContext.Provider
      value={{data, addWord, removeWord, markLearned, updateWord, addMemoryText, setStore, createGroup, updateGroup}}>
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
