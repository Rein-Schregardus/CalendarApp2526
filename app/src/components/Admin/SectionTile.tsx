import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

type TIcon = Parameters<typeof FontAwesomeIcon>[0]["icon"];

type SectionTileProps = {
  title: string;
  icon?: TIcon;
  children: React.ReactNode;
};

const SectionTile = ({ title, icon, children }: SectionTileProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <button
        className="flex items-center justify-between w-full p-4 text-left font-semibold hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {icon && <FontAwesomeIcon icon={icon} />}
          {title}
        </div>
        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
      </button>
      {expanded && (
        <div className="p-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

export default SectionTile;
