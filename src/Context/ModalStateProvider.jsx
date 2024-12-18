import React from 'react'
import { useState } from 'react'
import { createContext } from 'react';

export const ModalContext = createContext(null);

function ModalStateProvider(props) {
  const [isModalOpen ,setIsModalOpen] = useState(false);
  const [modalType , setModalType] = useState(null);
  const [roomId , setroomId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = ()=> {
    setIsModalOpen(false);
  }

  return (
    <div>
      <ModalContext.Provider value = {{isModalOpen, setIsModalOpen , openModal, closeModal, modalType , setModalType, roomId , setroomId}}>
          {props.children}
      </ModalContext.Provider>
    </div>
  )
}

export default ModalStateProvider
