import Navbar from '../components/Navbar';
import Schedule from '../components/Calendar/Schedule';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import { useContext, useState, type JSX } from 'react';
import NavSideBar from '../components/NavSideBar';

import type { NotificationType } from "@/types/NotificationType";
import ViewNotificationModal from "@/components/Modal/ViewNotificationModal";
import SetAttendance from '@/components/OfficeAttendance/SetAttendance';

const Home = () => {

  const [notification, setNotification] = useState<NotificationType | null>(null);



  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <NavSideBar />

      {/* Main Content */}
      <div className="w-full bg-background overflow-y-auto overflow-x-clip">
        <Navbar setNotification={setNotification} />

        <div className="p-4 flex flex-row gap-4 w-full flex-wrap-reverse justify-around items-end">
          {/* Left Section */}
          <div className=" min-w-60 w-full md:w-[62%] xl:w-[80%] md:h-[83vh]">
            <Schedule date={date} setDate={setDate} />
          </div>

          {/* Right Section */}
          <div className="w-full md:w-[35%] xl:w-[18%] flex flex-col gap-4 ">
              <SetAttendance></SetAttendance>
              <MiniCalendar date={date} setDate={setDate} />
            <div className="hidden md:inline w-full">
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;