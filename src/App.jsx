import './App.css';
import './index.css';
import { useContext } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import JoinRoomModal from './components/JoinRoomModal';
import CreateRoomModal from './components/CreateRoomModal';
import Screen from './components/Screen';
import { ModalContext } from './Context/ModalStateProvider';

function MainLayout() {
  const { isModalOpen, openModal, closeModal, setModalType, modalType } = useContext(ModalContext);

  const handleOpenJoinRoom = () => {
    setModalType('join');
    openModal();
  };

  const handleOpenCreateRoom = () => {
    setModalType('create');
    openModal();
  };

  return (
    <>
      <div className={isModalOpen ? 'blur' : ''}>
        <h1 className="Header">Call Favorite User</h1>
        <div className="basic-form">
          <button onClick={handleOpenJoinRoom}>Join Room</button>
          <span></span>
          <button onClick={handleOpenCreateRoom}>Create Room</button>
        </div>
      </div>

      {isModalOpen && (
        <>
          {modalType === 'join' && <JoinRoomModal />}
          {modalType === 'create' && <CreateRoomModal />}
        </>
      )}
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />} />
      <Route path="/screen" element={<Screen />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
