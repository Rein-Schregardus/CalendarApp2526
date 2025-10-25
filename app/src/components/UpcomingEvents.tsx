import EventCard from "./EventCard"

const events = [
    {
        id: 1,
        title: "Lorem ipsum dolor",
        date: "10/09/2025",
        time: "10:00 - 16:00",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 2,
        title: "Lorem ipsum dolor",
        date: "19/09/2025",
        time: "09:00 - 13:00",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 3,
        title: "Lorem ipsum dolor",
        date: "24/09/2025",
        time: "10:00 - 16:00",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
    {
        id: 4,
        title: "Lorem ipsum dolor",
        date: "24/09/2025",
        time: "10:00 - 16:00",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    },
]

const UpcomingEvents = () => {
  return (
    <div className='bg-white p-4 rounded-md flex flex-col gap-2'>
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold my-4">Upcoming Events</h1>
            <button className="flex items-center border-none text-gray-500 hover:text-accent cursor-pointer transition">
                <span className="text-md">View more...</span>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
            {events.slice(0, 3).map((event) => (
                <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                />
            ))}
        </div>
    </div>
  )
}

export default UpcomingEvents