import Navbar from '../components/Navbar';
import Schedule from '../components/Calendar/Schedule';
import MiniCalendar from '../components/Calendar/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import NavSideBar from '../components/NavSideBar';
import { useState } from 'react';

const Home = () => {

  const [date, setDate] = useState<Date>(new Date());

  console.log(date)

  return (
     <div className="h-screen flex">
        {/* Sidebar */}
        <NavSideBar/>

        {/* Main Content */}
        <div className="w-5/6 bg-background overflow-y-scroll flex-1">
          <Navbar />

          <div className="p-4 flex flex-row gap-4">
            {/* Left Section */}
            <div className="w-3/4 flex flex-col gap-8">
              <div className="w-full h-[800px]">
                <Schedule date={date}/>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-1/4 flex flex-col gap-8 ">
              <div className="w-full h-[416px]">
                <MiniCalendar date={date} setDate={setDate} />
              </div>
              <div className="w-full h-[375px]">
                <UpcomingEvents/>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

  

 


export default Home;
