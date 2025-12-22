import { useEffect, useState } from "react";
import AttendanceTag from "./AttendanceTag";

const SetAttendance = () => {
  const [inOffice, setInOffice] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const GetInOffice = async() => {
    setIsLoading(true);

    const response = await fetch("http://localhost:5005/officeAttendance/me", {credentials: "include"});
    const body: boolean = await response.json();

    setInOffice(body);
    setIsLoading(false);
  }

  const LeaveOffice = async() => {
    setIsLoading(true);

    const response = await fetch("http://localhost:5005/officeAttendance/stop", {credentials: "include", method: "Post"});
    const body: boolean = await response.json();

    setInOffice(body);
    setIsLoading(false);
  }

  const EnterOffice = async() => {
    setIsLoading(true);

    const response = await fetch("http://localhost:5005/officeAttendance/start", {credentials: "include", method: "Post"});
    const body: boolean = await response.json();

    setInOffice(body);
    setIsLoading(false);
  }

  useEffect(() => {GetInOffice()}, [])

  return (
    <div className="bg-primary rounded-lg shadow-2xl">
      <p className="text-center w-full p-1 font-semibold">Set Attendance</p>
      <div className="p-1 border-t-2 border-t-secondary rounded-b-lg flex flex-col">
        <div>
          <span>You are: </span>
          {!isLoading && <AttendanceTag isPresent={inOffice || false}/>}
        </div>
      {
        isLoading?
        <div className="animate-pulse bg-accent text-primary rounded-sm p-1 m-1">Loading</div>
        :
        inOffice?
        <button className="block bg-accent text-primary hover:shadow-md cursor-pointer rounded-sm p-1 m-1" onClick={() => LeaveOffice()}>Leave Office</button>
        :
        <button className="block bg-accent text-primary hover:shadow-md cursor-pointer rounded-sm p-1 m-1" onClick={() => EnterOffice()}>Enter Office</button>
      }
      </div>
    </div>
  )
}

export default SetAttendance;