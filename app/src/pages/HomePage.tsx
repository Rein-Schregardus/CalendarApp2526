import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule';
import MiniCalendar from '../components/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import NavSideBar from '../components/NavSideBar';
import DropdownButton from '../components/Dropdown/DropdownButton';
import DropdownItem from '../components/Dropdown/DropdownItem';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { EventForm } from '../components/Forms/EventForm';
// Uncomment if these exist
// import { RoomForm } from '../components/Forms/RoomForm';
// import { WorkForm } from '../components/Forms/WorkForm';
import AdvancedOptions from '../components/Forms/AdvancedOptions';

type ModalType = "event" | "room" | "work";

const Home = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("event");

  const openCrudModal = (type: ModalType) => {
    setModalType(type);
    setOpenModal(true);
  };

  const renderForm = () => {
    switch (modalType) {
      case "event":
        return <EventForm />;
      // Uncomment these lines if forms exist
      // case "room":
      //   return <RoomForm />;
      // case "work":
      //   return <WorkForm />;
      default:
        return null;
    }
  };

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
          title={
            modalType === "event"
              ? "Event"
              : modalType === "room"
              ? "Room Reservation"
              : "Work Schedule"
          }
          leftContent={renderForm()}
          rightContent={
            <>
              <h3 className="font-semibold text-sm">Instructions</h3>
              <p className="text-xs text-gray-600">
                Fill out all required fields on the left. You can switch to another form below.
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <span className="font-semibold text-sm">Switch Form</span>
                <DropdownButton
                  label="New"
                  icon={faPlus}
                  className="flex items-center justify-evenly gap-2 bg-white cursor-pointer shadow-lg rounded-xl p-4"
                >
                  <DropdownItem onClick={() => setModalType("event")}>Event</DropdownItem>
                  <DropdownItem onClick={() => setModalType("room")}>Room Reservation</DropdownItem>
                  <DropdownItem onClick={() => setModalType("work")}>Work Schedule</DropdownItem>
                </DropdownButton>
              </div>

              <div className="mt-6">
                <AdvancedOptions />
              </div>
            </>
          }
        />
      )}
    </div>
  );
};

export default Home;
