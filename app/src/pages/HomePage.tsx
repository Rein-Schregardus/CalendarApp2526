import Navbar from '../components/Navbar';
import Schedule from '../components/Calendar/Schedule';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useState, type JSX } from 'react';
import Modal from '../components/Modal/Modal';
import NavSideBar from '../components/NavSideBar';

import type { NotificationType } from "@/types/NotificationType";
import ViewNotificationModal from "@/components/Modal/ViewNotificationModal"; 

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
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const [modalType, setModalType] = useState<ModalType>("event");
  const [date, setDate] = useState<Date>(new Date());

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
        <Navbar openCrudModal={openCrudModal} setNotification={setNotification}/>

          <div className="p-4 flex flex-row gap-4">
            {/* Left Section */}
            <div className="w-4/5 flex flex-col gap-8">
              <div className="w-full h-[800px]">
                <Schedule date={date} setDate={setDate}/>
              </div>
            </div>

          {/* Right Section */}
          <div className="w-1/5 flex flex-col gap-8">
            <div className="w-full h-[375px]">
              <MiniCalendar date={date} setDate={setDate} />
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

      {notification && (
        <ViewNotificationModal setNotification={setNotification} notification={notification}/>
      )}
    </div>
  );
};

export default Home;