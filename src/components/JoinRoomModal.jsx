import React, { useContext, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../Context/ModalStateProvider';
import axios from 'axios';

function JoinRoomModal() {
    const { isModalOpen, setIsModalOpen, closeModal ,setroomId } = useContext(ModalContext);
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleJoin = async () => {
        try {
            if(inputValue) {
            const response = await axios.get(`https://web-back-1.onrender.com/checkroom/${inputValue}`);

            if (response.data.exists) {
                console.log('Room ID successfully found:', inputValue);
                setroomId(inputValue);
                navigate('/screen');
            } else {
                console.log('Room ID does not exist. Please enter a valid Room ID.');
            }
        }else{
            console.log('Unable to join Room. Please try again.');
        }
        } catch (error) {
            console.error('Error checking Room ID:', error);
           
        }
    };

    return (
        <div className='Modal-overlay'>
            <div className='Modal-top'>
                <p>Join Room</p>
                <div className='cancel' onClick={closeModal}>
                    <ImCancelCircle />
                </div>
            </div>

            <div className="Modal-content">
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button onClick={handleJoin}>Join</button>
            </div>
        </div>
    );
}

export default JoinRoomModal;
