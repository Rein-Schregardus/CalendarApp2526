import React, { useState } from "react";
import EventCard from "./EventCard";
import Modal from "./Modal/Modal";

const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    date: "10/09/2025",
    time: "10:00 - 16:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    date: "19/09/2025",
    time: "09:00 - 13:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    date: "24/09/2025",
    time: "10:00 - 16:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor",
    date: "24/09/2025",
    time: "10:00 - 16:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const UpcomingEvents: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(
    null
  );

  const handleEventClick = (event: (typeof events)[0]) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-4">Upcoming Events</h1>
        <button className="flex items-center border-none text-gray-500 hover:text-accent cursor-pointer transition">
          <span className="text-md">View more...</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {events.slice(0, 3).map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="cursor-pointer transition hover:scale-[1.01]"
          >
            <EventCard
              title={event.title}
              description={event.description}
              date={event.date}
            />
          </div>
        ))}
      </div>

      {openModal && selectedEvent && (
        <Modal setOpenModal={setOpenModal} title={selectedEvent.title} size="md">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p className="text-gray-700">{selectedEvent.description}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UpcomingEvents;
