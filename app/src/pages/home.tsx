import NavSideBar from "../components/NavSideBar";
// import Calendar from "../components/Calendar";
// import CalendarColumn from "../Models/CalendarColumn";
// import CalendarTimeBlock from "../Models/CalendarTimeBlock";

export default function HomePage(){
    return(
        <div>
        <NavSideBar/>
        {/* <Calendar columns={[
            new CalendarColumn("room 102",[new CalendarTimeBlock(new Date(2025, 8, 30, 13, 30), new Date(2025, 8, 30, 17, 0), "blah blah 2, more talking")])
        ]}/> */}
        </div>
    )
}