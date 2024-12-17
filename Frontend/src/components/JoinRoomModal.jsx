import React from 'react';
import { ImCancelCircle } from "react-icons/im";
import { useContext } from 'react';
import { ModalContext } from '../Context/ModalStateProvider';
import { useNavigate } from 'react-router-dom';

function JoinRoomModal() {
    const { isModalOpen, setIsModalOpen, setIsModalClose, openModal, closeModal } = useContext(ModalContext);
    const navigate = useNavigate();

    const handleJoin = () => {
        navigate('/screen');
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
                <input type="text" placeholder="Room ID" />
                <button onClick={handleJoin}>Join</button>
            </div>
        </div>
    );
}

export default JoinRoomModal;
