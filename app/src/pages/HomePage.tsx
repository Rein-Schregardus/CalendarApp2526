import Navbar from '../components/Navbar';
import Schedule from '../components/Schedule';
import MiniCalendar from '../components/MiniCalendar';
import UpcomingEvents from '../components/UpcomingEvents';
import NavSideBar from '../components/NavSideBar';

const Home = () => (
  <div className="h-screen flex">
    {/* Sidebar */}
    <NavSideBar/>

    {/* Main Content */}
    <div className="w-5/6 bg-background overflow-y-scroll">
      <Navbar />

      <div className="p-4 flex flex-row gap-4">
        {/* Left Section */}
        <div className="w-3/4 flex flex-col gap-8">
          <div className="w-full h-[800px]">
            <Schedule />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/4 flex flex-col gap-8 ">
          <div className="w-full h-[350px]">
            <MiniCalendar />
          </div>
          <div className="w-full h-[375px]">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
