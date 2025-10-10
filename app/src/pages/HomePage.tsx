import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule';
import MiniCalendar from '../components/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useState } from 'react';
import Modal from '../components/Modal/Modal';

import { EventForm } from '../components/Forms/EventForm';
// import { EventForm } from '../components/Forms/RoomForm';
// import { EventForm } from '../components/Forms/WorkForm';

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
    <NavSideBar/>
    <NavSideBar/>

    {/* Main Content */}
    <div className="w-5/6 bg-background overflow-y-scroll">
      <Navbar />

      <div className="p-4 flex flex-row gap-4">
        {/* Left Section */}
        <div className="w-3/4 flex flex-col gap-8">
        <div className="w-3/4 flex flex-col gap-8">
          <div className="w-full h-[800px]">
            <Schedule />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/4 flex flex-col gap-8 ">
          <div className="w-full h-[350px]">
        <div className="w-1/4 flex flex-col gap-8 ">
          <div className="w-full h-[350px]">
            <MiniCalendar />
          </div>
          <div className="w-full h-[375px]">
            <UpcomingEvents />
          </div>
          <div className="w-full h-[375px]">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
    {/* Modal */}
      {openModal && modalType && (
        <Modal
          setOpenModal={() => setOpenModal(false)}
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
  );
};

export default Home;
