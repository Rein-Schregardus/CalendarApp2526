import NavSideBar from "../components/NavSideBar";
import EventCard from "../components/EventCard";
import type IEventModel from "../types/IEventModel";
import { useState, useEffect } from "react";
import DropdownButton from "../components/Dropdown/DropdownButton";
import DropdownItem from "../components/Dropdown/DropdownItem";

const events: IEventModel[] = [
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "titilus",
    description: "disctipiorix",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "the cleaning cupboard",
    createdBy: "albrecht",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "event 2",
    description: "even more edventagous than the first and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going and the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "atrium",
    createdBy: "john user",
    createdAt: new Date(2025, 10, 8)
    },
    {
    title: "wow so many events",
    description: "it's like we plan these things and the descrition just keeps going and the descrition just keeps goingand the descrition just keeps going.",
    date: new Date(2025, 10, 20),
    startTime: new Date(0, 0, 0, 10, 30),
    endTime: new Date(0, 0, 0, 12, 0),
    location: "b2s4r52",
    createdBy: "Zuurkauw",
    createdAt: new Date(2025, 10, 8)
    },
];

const EventPage = () => {
    const [Events, SetDisplayEvents] = useState(Array<IEventModel>);
    const [timeFilter, setTimeFilters] = useState<string>("Future");
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchLocation, setSearchLocation] = useState<string>("");

    useEffect(() => {
        const delayDebounceFn: number = setTimeout(() => {
        console.log(timeFilter);
        // Send request here
        }, 500)

        return () => clearTimeout(delayDebounceFn);
    }, [timeFilter, searchTitle, searchLocation]);

    return(
        <div className="max-h-screen flex">
            <NavSideBar />
            {/* Main page content */}
            <div className="bg-background flex-1 grid">
            {/* Filter options menu */}
                <div className="bg-primary h-fit shadow-xl/5 p-3 rounded-md m-2 col-end-1">
                    <button className=" bg-accent rounded-md my-0.5 p-0.5 w-[100%] h-10 text-primary font-bold cursor-pointer hover:shadow-md transition-all duration-200">Create Event</button>
                    <h2 className="border-secondary border-solid border-t-1 mt-1">Filters</h2>
                    <ul>
                        <li>
                            <DropdownButton label={`Time: ${timeFilter}`} className="bg-secondary rounded-md my-0.5 p-0.5">
                                <DropdownItem onClick={() => setTimeFilters("Future")}>Future</DropdownItem>
                                <DropdownItem onClick={() => setTimeFilters("Past")}>Past</DropdownItem>
                                <DropdownItem onClick={() => setTimeFilters("Today")}>Today</DropdownItem>
                                <DropdownItem onClick={() => setTimeFilters("All")}>All</DropdownItem>
                            </DropdownButton>
                        </li>
                        <li>
                            <input type="text" onChange={((ev) => setSearchTitle(ev.target.value))} maxLength={100} placeholder={"Event Name"} className=" bg-secondary rounded-md my-0.5 p-0.5"></input>
                        </li>
                        <li>
                            <input type="text" onChange={((ev) => setSearchLocation(ev.target.value))} maxLength={100} placeholder={"Location"} className=" bg-secondary rounded-md my-0.5 p-0.5"></input>
                        </li>
                    </ul>
                </div>

            {/* Events display */}
                <div className="flex flex-col m-2 p-2 bg-primary shadow-xl/10 rounded-md gap-1 overflow-auto md:col-start-[-1] sm:col-start-1 min-h-60">
                {events.map((event) => (
                    <EventCard
                        title={event.title}
                        description={event.description}
                        date={event.date.toLocaleDateString() +" "+ event.startTime.toLocaleTimeString()}
                    />
                ))}
                </div>
            </div>
        </div>
    )
}

export default EventPage;

