import React, { useState, useContext } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../Context/ModalStateProvider';
import axios from 'axios'

function CreateRoomModal() {
  const { isModalOpen, setIsModalOpen, closeModal, setroomId ,roomId } = useContext(ModalContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(''); 

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleCreateRoom = async() => {
 try {
     if (inputValue) {
       setroomId(inputValue);
       const response = await axios.post('https://web-back-1.onrender.com/setroomId', { roomId: inputValue });
 
       if (response.data.success) {
         console.log('Room ID successfully added:', inputValue);
         navigate('/screen');
       } else {
         console.log('Failed to add Room ID:', response.data.message);
       }
     } else {
       console.log('Please enter a valid Room ID');
     }
 } catch (error) {
  console.log("error in sending request at backend to set room id");
 }
  };

  return (
    <div className="Modal-overlay">
      <div className="Modal-top">
        <p>Create Room</p>
        <div className="cancel" onClick={closeModal}>
          <ImCancelCircle />
        </div>
      </div>

      <div className="Modal-content">
        <input
          type="number"
          placeholder="Room ID"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateRoom}>Create</button>
      </div>
    </div>
  );
}

export default CreateRoomModal;
