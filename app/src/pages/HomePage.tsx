import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule';
import MiniCalendar from '../components/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useState, type JSX } from 'react';
import Modal from '../components/Modal/Modal';
import NavSideBar from '../components/NavSideBar';

import { EventForm } from '../components/Forms/EventForm';
// import { RoomForm } from '../components/Forms/RoomForm';
// import { WorkForm } from '../components/Forms/WorkForm';
import AdvancedOptions from '../components/Forms/AdvancedOptions';

type ModalType = "event" | "room" | "work";

const modalConfig: Record<
  ModalType,
  { title: string; component: JSX.Element | null }
> = {
  event: { title: "New Event", component: <EventForm /> },
  room: { title: "New Room", component: null /* <RoomForm /> */ },
  work: { title: "New Work Schedule", component: null /* <WorkForm /> */ },
};

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("event");

  const openCrudModal = (type: ModalType) => {
    setModalType(type);
    setOpenModal(true);
  };

  const { title, component: leftContent } = modalConfig[modalType];

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <NavSideBar />

      {/* Main Content */}
      <div className="w-5/6 bg-background overflow-y-scroll flex-1">
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
      </div>

      {/* Modal */}
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          title={title}
          leftContent={leftContent}
          rightContent={<AdvancedOptions />}
        />
      )}
    </div>
  );
};

export default Home;
