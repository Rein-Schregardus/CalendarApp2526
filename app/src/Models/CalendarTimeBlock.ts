class CalendarTimeBlock
{
    Start: Date;
    End: Date;
    Name: string;

    constructor(start: Date, end: Date, name: string)
    {
        this.Start = start;
        this.End = end;
        this.Name = name;
    }
}

export default CalendarTimeBlock;