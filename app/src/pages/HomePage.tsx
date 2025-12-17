import Navbar from '../components/Navbar';
import Schedule from '../components/Calendar/Schedule';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useContext, useState, type JSX } from 'react';
import Modal from '../components/Modal/Modal';
import NavSideBar from '../components/NavSideBar';

import type { NotificationType } from "@/types/NotificationType";
import ViewNotificationModal from "@/components/Modal/ViewNotificationModal";

const Home = () => {

  const [notification, setNotification] = useState<NotificationType | null>(null);

  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <NavSideBar />

      {/* Main Content */}
      <div className="w-5/6 bg-background overflow-y-auto overflow-x-clip flex-1">
        <Navbar setNotification={setNotification}/>

          <div className="p-4 flex flex-row gap-4 h-[85%]">
            {/* Left Section */}
            <div className="w-4/5 flex flex-col gap-8">
              <div className="w-full min-h-[600px] max-h-[100%]">
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
      {notification && (
        <ViewNotificationModal setNotification={setNotification} notification={notification}/>
      )}
    </div>
  );
};

export default Home;