import { type JSX, useEffect, useRef } from "react";
import TimeOccupant from "../models/CalendarTimeBlock";
import CalendarColumn from "../models/CalendarColumn";
import styles from "./Calendar.module.css";

export default function Calendar({ columns }: { columns: CalendarColumn[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 500;
        }
    });

    let timestamps: JSX.Element[] = new Array;
    let timeblocks: JSX.Element[] = new Array;

    for (let columnI = columns.length; columnI > 0; columnI--) {
        const column: CalendarColumn = columns[columnI - 1];
        // sort orders the array so that later start times are drawn over early starters
        column.Content.sort((a, b) => a.Start > b.Start? 1: -1).forEach((occupant: TimeOccupant, i:number) => {
            // get variables needed to draw the events onto the calender
            const startoffset: number = occupant.Start.getHours() * 60 + occupant.Start.getMinutes();
            const durationDate: Date = new Date(+occupant.End - +occupant.Start);
            const durationHours = durationDate.getHours() * 60 + durationDate.getMinutes();
            const eventOverlap = column.Content.slice(0, i).filter((oc) =>+occupant.Start - +oc.Start - 1000 * 60 * 10  <= 0).length;
            console.log(column.Content);
            timeblocks.push( // place the events in the calender.
                <button className={`${styles.dayCalendarBlock}`}
                onClick={() => alert("you have done the impossible!")}
                    style={{
                        gridRow: `${startoffset + 61}`,
                        gridColumn: `${columnI}`,
                        gridRowEnd: `${startoffset + durationHours + 1}`,
                        width: `${90 - eventOverlap * 10}%`,
                    }}>
                    <div>{occupant.Name}</div>
                    <div>{occupant.Start.toLocaleTimeString()}</div>
                    <div>{occupant.End.toLocaleTimeString()}</div>
                </button>)
        });

        timestamps.push(<div className={`${styles.calenderColumnHeader}`} style={{ // draws column headers
            gridRow: "1",
            gridColumn: `${columnI}`,
            gridRowEnd: "61"
        }}>{column.Header}</div>)

        for (let y = 0; y < 24; y++) {
            timestamps.push(
                <div className={`${styles.hours}`} // create those squares behind the actual events
                    style={{
                        gridRow: `${y * 60 + 61}`,
                        gridColumn: `${columnI}`,
                        gridRowEnd: `${(y + 1) * 60 + 61}`
                    }}>
                </div>)
        }
    }

    for (let y = 0; y < 24; y++) { // hour notation
        timestamps.push(
            <div className={`${styles.hours}`}
                style={{
                    gridRow: `${y * 60 + 61}`,
                    gridColumn: `1`,
                    gridRowEnd: `${(y + 1) * 60 + 61}`
                }}>
                {y}:00
            </div>)
    }



    return (
        <div className={`${styles.calender}`} ref={scrollRef}>
            {timestamps}
            {timeblocks}
        </div>
    )
}