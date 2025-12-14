import { createContext, useState } from "react";

type TModalContext = {
  setModal: (newModal: React.ReactElement) => void,
  removeModal: () => void,
  isModalOpen: boolean,
}

const GlobalModalContext = createContext<TModalContext>({
  setModal: (newModal: React.ReactElement) => {throw new Error("Opperation: setModal unavailable.")},
  removeModal: () => {throw new Error("Opperation: removeModal unavailable.")},
  isModalOpen: false

})

const GlobalModalProvider = ({ children }: { children?: React.ReactElement }) => {
  const [modal, _setModal] = useState<React.ReactElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const setModal = (newModal: React.ReactElement) => {
    if (!newModal) throw new Error(`Provided modal was falsy ${newModal}`);
    setModal(newModal);
    setIsModalOpen(true);
  }

  const removeModal = () => {
    if (modal)
    {
      _setModal(null);
      setIsModalOpen(false);
    }
    else
    {
      console.log("There was no modal to close.");
    }
  }

  return (
    <GlobalModalContext.Provider value={{setModal, removeModal, isModalOpen}}>
      {children}
      {modal}
    </GlobalModalContext.Provider>
  );
}

export default (GlobalModalProvider)