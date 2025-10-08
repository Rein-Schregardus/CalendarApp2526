import CalendarTimeBlock from "./CalendarTimeBlock";

export default class CalendarColumn{
    readonly Header:string;
    readonly Content: CalendarTimeBlock[];

    constructor(header: string, content: CalendarTimeBlock[]){
        this.Header = header;
        this.Content = content;
    }
}