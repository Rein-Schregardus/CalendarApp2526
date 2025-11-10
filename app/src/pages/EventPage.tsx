import NavSideBar from "../components/NavSideBar";
import EventCard from "../components/EventCard";
import type IEventModel from "../types/IEventModel";
import { useState, useEffect, type JSX, useContext } from "react";
import DropdownButton from "../components/Dropdown/DropdownButton";
import DropdownItem from "../components/Dropdown/DropdownItem";
import Modal from "../components/Modal/Modal";
import { EventForm } from "../components/Forms/EventForm";

import {parse} from "date-fns";
import AdvancedOptions from "../components/Forms/AdvancedOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "@/hooks/UserContext";

// modal

const modalConfig: Record<
  "event" | "viewEvent",
  { title: string; component: JSX.Element | null }
> = {
  event: { title: "New Event", component: <EventForm /> },
  viewEvent: {title: "View Event", component: null}
};
// end modal

const  FetchEvents = async(time?: string, searchTitle?: string, searchLocation?: string, searchCreator?: string, searchAttendee?: string) => {
    let events: IEventModel[] = [];
    let fetchParameters = "?";
    let fetchParamsArr: string[] = [];
    if (time)
    {
        fetchParamsArr.push(`time=${time}`);
    }
    if (searchTitle)
    {
        fetchParamsArr.push(`title=${searchTitle}`);
    }
    if (searchLocation)
    {
        fetchParamsArr.push(`location=${searchLocation}`);
    }
    if (searchCreator)
    {
        fetchParamsArr.push(`creator=${searchCreator}`);
    }
    if (searchAttendee)
    {
        fetchParamsArr.push(`attendee=${searchAttendee}`);
    }
    fetchParameters = fetchParameters += fetchParamsArr.join("&");

    try{
        const response = await fetch("http://localhost:5005/api/Events/GetFiltered" + fetchParameters, {credentials: "include"});
        const body = await response.json();
        events = body.map((ev: any) => {
            return {
                title: ev.title,
                description: ev.description,
                date: new Date(ev.date) ,
                startTime: parse(ev.startTime, "HH:mm:ss", new Date()),
                endTime: parse(ev.startTime, "HH:mm:ss", new Date()),
                location: ev.location,
                createdBy: ev.createdBy,
                createdAt:  new Date(ev.createdAt)
            } as IEventModel
        });
    }
    catch{
        events = [];
    }
    return events;
}

const EventPage = () => {

    const [Events, SetDisplayEvents] = useState(Array<IEventModel>);
    const [timeFilter, setTimeFilters] = useState<string>("Future");
    const [searchTitle, setSearchTitle] = useState<string>("");
    const [searchLocation, setSearchLocation] = useState<string>("");
    const [searchCreator, setSearchCreator] = useState<string>("");
    const [searchAttendee, setSearchAttendee] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [openModal, setOpenModal] = useState(false);
    const userContext = useContext(UserContext);

    useEffect(() => {
        const delayDebounceFn: number = setTimeout(async () => {
            setIsLoading(true);
            SetDisplayEvents(
            await FetchEvents(timeFilter, searchTitle, searchLocation, searchCreator, searchAttendee));
            setIsLoading(false);
        }, 500)

        return () => clearTimeout(delayDebounceFn);
    }, [timeFilter, searchTitle, searchLocation, searchCreator, searchAttendee, openModal]);



      const openCrudModal = () => {
        setOpenModal(true);
      };


    const { title, component: leftContent } = modalConfig["event"];

    return(
        <div className="h-screen flex">
            <NavSideBar />
            {/* Main page content */}
            <div className="bg-background flex-1 grid md:grid-cols-[20rem_auto] sm:grid-cols-auto grid-rows-[auto_1fr] md:overflow-hidden overflow-auto">
            {/* Filter options menu */}
                <div className="bg-primary h-fit shadow-xl/5 p-3 rounded-md m-2 col-start-1">
                    <button className=" bg-accent rounded-md my-0.5 p-0.5 w-[100%] h-10 text-primary font-bold cursor-pointer hover:shadow-md transition-all duration-200" onClick={() => {openCrudModal()}}>Create Event</button>
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
                        <li>
                            <input type="text" onChange={((ev) => setSearchCreator(ev.target.value))} maxLength={100} placeholder={"Creator"} value={searchCreator} className=" bg-secondary rounded-md my-0.5 p-0.5"></input>
                            <input type="button"  value="Me" onClick={() => setSearchCreator(userContext.getCurrUser()?.email || "")} className="mx-1 bg-secondary rounded-md my-0.5 p-0.5 hover:shadow-md"></input>
                        </li>
                        <li>
                            <input type="text" onChange={((ev) => setSearchAttendee(ev.target.value))} maxLength={100} placeholder={"Attendee"} value={searchAttendee} className=" bg-secondary rounded-md my-0.5 p-0.5"></input>
                            <input type="button" value="Me" onClick={() => setSearchAttendee(userContext.getCurrUser()?.email || "")} className="mx-1 bg-secondary rounded-md my-0.5 p-0.5 hover:shadow-md"></input>
                        </li>
                    </ul>
                </div>
            {/* Events display */}
                <div className="flex flex-col m-2 p-2 bg-primary shadow-xl/10 rounded-md gap-1 overflow-auto min-h-60 h-[100%]">
                <p>Found {Events.length} events</p>
                {isLoading &&
                <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 border-t-accent text-gray-400"> Loading Events Please be patient
                    <div className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin"/>
                    </div>
                </div>}
                {Events.map((event) => (
                    <EventCard
                        event={event}
                    />
                ))}
                {(!isLoading && Events.length === 0)? <div className="bg-orange-800 text-primary font-medium m-4 p-4 rounded-sm">No Events Found<p className="font-light">Your filters might be a little excessive.</p></div>: null}
                </div>
            </div>
            {/* Modal */}
            {openModal && (
                <Modal
                setOpenModal={setOpenModal}
                title={title}
                leftContent={leftContent}
                rightContent={<AdvancedOptions />}
                />
            )}

        </div>
    )
}

export default EventPage;

