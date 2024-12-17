import React from 'react'
import { ImCancelCircle } from "react-icons/im";
import { useContext } from 'react';
import { ModalContext } from '../Context/ModalStateProvider';
import { useNavigate } from 'react-router-dom';




function CreateRoomModal() {
    const {isModalOpen, setIsModalOpen ,setIsModalClose , openModal, closeModal } = useContext(ModalContext);
    const navigate = useNavigate();


    const handleCreateRoom = () => {
      navigate('/screen');
    }
   return (
    <div className = 'Modal-overlay'>
        <div className = 'Modal-top'>
            <p>Create Room</p>
            <div className = 'cancel' onClick={closeModal}> <ImCancelCircle /> </div>
        </div>
     
     <div className = "Modal-content">
        <input type="text" placeholder="Room ID" />
        <button onClick={handleCreateRoom}>Create</button>  
        </div>
    </div>
       
  )
}

export default CreateRoomModal
