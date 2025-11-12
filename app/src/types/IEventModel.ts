export default interface IEventModel{
    id: number;
    title: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    createdBy: string;
    createdAt: Date;
}