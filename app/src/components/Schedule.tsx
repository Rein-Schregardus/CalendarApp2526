import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCaretDown } from "@fortawesome/free-solid-svg-icons";

import DropdownButton from "./Dropdown/DropdownButton";
import DropdownItem from "./Dropdown/DropdownItem";

import SmallButton from "./SmallButton";
import { useState } from "react";

const Schedule = () => {
  const [viewType, setViewType] = useState("Week")
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
            <SmallButton>
              <FontAwesomeIcon icon={faChevronLeft} />
            </SmallButton>
            <SmallButton>
              <FontAwesomeIcon icon={faChevronRight} />
            </SmallButton>
          </div>

          {/* Month title */}
          <h2 className="text-lg font-semibold">October 2025</h2>
        </div>

        {/* View type dropdown */}
        <DropdownButton 
          label={viewType}
          className="flex items-center justify-between gap-2 border border-gray-500 rounded-full min-w-20 h-10 px-4 cursor-pointer hover:bg-[#e0e2e6] transition"
        >
          <DropdownItem onClick={() => setViewType("Day")}>Day</DropdownItem>
          <DropdownItem onClick={() => setViewType("Week")}>Week</DropdownItem>
          <DropdownItem onClick={() => setViewType("Month")}>Month</DropdownItem>
        </DropdownButton>
      </div>

      <hr className="my-4 text-gray-300" />

      {/* Content */}
      <div className="text-gray-600">Schedule content</div>
    </div>
  );
};

export default Schedule;
