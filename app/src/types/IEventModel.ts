export default interface IEventModel{
    id: number;
    title: string;
    description: string;
    start: Date;
    duration: number;
    location: string;
    createdBy: string;
    createdAt: Date;
}