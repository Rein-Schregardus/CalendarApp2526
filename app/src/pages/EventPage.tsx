import NavSideBar from "../components/NavSideBar";
import EventCard from "../components/EventCard";
import type IEventModel from "../types/IEventModel";
import { useState, useEffect } from "react";
import DropdownButton from "../components/Dropdown/DropdownButton";
import DropdownItem from "../components/Dropdown/DropdownItem";
import { fetchHelper } from "../helpers/fetchHelper.ts";
import {parse} from "date-fns";


const  FetchEvents = async(time?: string, searchTitle?: string, searchLocation?: string, searchCreator?: string) => {
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
    fetchParameters = fetchParameters += fetchParamsArr.join("&");

    console.log(fetchParameters);
    try{
        const response = await fetch("http://localhost:5005/api/Events/GetFiltered" + fetchParameters);
        const body = await response.json();
        events = body.map((ev: any) => {
            console.log(ev.startTime);
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
        console.log(events);
    }
    catch{
        alert("events could not be loaded");
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

    useEffect(() => {
        const delayDebounceFn: number = setTimeout(async () => {
        SetDisplayEvents(await FetchEvents(timeFilter, searchTitle, searchLocation, searchCreator))
        }, 500)

        return () => clearTimeout(delayDebounceFn);
    }, [timeFilter, searchTitle, searchLocation, searchCreator]);

    return(
        <div className="h-screen flex">
            <NavSideBar />
            {/* Main page content */}
            <div className="bg-background flex-1 grid md:grid-cols-[20rem_auto] sm:grid-cols-auto grid-rows-[auto_1fr] md:overflow-hidden sm:overflow-auto">
            {/* Filter options menu */}
                <div className="bg-primary h-fit shadow-xl/5 p-3 rounded-md m-2 col-start-1">
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
                        <li>
                            <input type="text" onChange={((ev) => setSearchCreator(ev.target.value))} maxLength={100} placeholder={"Creator"} value={searchCreator} className=" bg-secondary rounded-md my-0.5 p-0.5"></input>
                            <input type="button" onClick={(() => setSearchCreator("my events"))} value="Me" className="mx-1 bg-secondary rounded-md my-0.5 p-0.5 hover:shadow-md"></input>
                        </li>
                    </ul>
                </div>

            {/* Events display */}
                <div className="flex flex-col m-2 p-2 bg-primary shadow-xl/10 rounded-md gap-1 overflow-auto min-h-60 h-[100%]">
                <p>Found {Events.length} events</p>
                {Events.map((event) => (
                    <EventCard
                        title={event.title}
                        description={event.description}
                        //date={""}
                        date={event.date.toLocaleDateString() +" "+ event.startTime}
                    />
                ))}
                {Events.length !== 0? null: <div className="bg-orange-800 text-primary font-medium m-4 p-4 rounded-sm">No Events Found<p className="font-light">Your filters might be a little excessive.</p></div>}
                </div>
            </div>
        </div>
    )
}

export default EventPage;

