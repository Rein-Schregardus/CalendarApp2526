import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Schedule = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-[4px_4px_9px_4px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-8">
          {/* Today button */}
          <button className="flex items-center border border-gray-500 rounded-full h-10 px-8 cursor-pointer hover:bg-[#e0e2e6] transition">
            <span className="text-base">Today</span>
          </button>

          {/* Arrow buttons */}
          <div className="flex items-center justify-center gap-1">
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#e0e2e6]">
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#e0e2e6]">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>

          {/* Month title */}
          <h2 className="text-lg font-semibold">October 2025</h2>
        </div>

        {/* Week button */}
        <button className="flex items-center border border-gray-500 rounded-full h-10 px-8 cursor-pointer hover:bg-[#e0e2e6] transition">
          <span className="text-base mr-2">Week</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </div>

      <hr className="my-4" />

      {/* Content */}
      <div className="text-gray-600">Schedule content</div>
    </div>
  );
};

export default Schedule;
