import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule';
import MiniCalendar from '../components/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import NavSideBar from '../components/NavSideBar';

import { EventForm } from '../components/Forms/EventForm';
// import { RoomForm } from '../components/Forms/RoomForm';
// import { WorkForm } from '../components/Forms/WorkForm';

type ModalType = "event" | "room" | "work";

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openCrudModal = (type: ModalType) => {
    setModalType(type);
    setOpenModal(true);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <NavSideBar />

      {/* Main Content */}
      <div className="w-5/6 bg-background overflow-y-scroll">
        <Navbar openCrudModal={openCrudModal} />

        <div className="p-4 flex flex-row gap-4">
          {/* Left Section */}
          <div className="w-3/4 flex flex-col gap-8">
            <div className="w-full h-[800px]">
              <Schedule />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-1/4 flex flex-col gap-8">
            <div className="w-full h-[350px]">
              <MiniCalendar />
            </div>
            <div className="w-full h-[375px]">
              <UpcomingEvents />
            </div>
          </div>
        </div>

        {/* Modal */}
        {openModal && modalType && (
          <Modal
            setOpenModal={setOpenModal}
            title={
              modalType === "event"
                ? "Event"
                : modalType === "room"
                ? "Room Reservation"
                : "Work Schedule"
            }
            size="md"
          >
            {modalType === "event" && <EventForm />}
            {/* {modalType === "room" && <RoomForm />}
            {modalType === "work" && <WorkForm />} */}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Home;
