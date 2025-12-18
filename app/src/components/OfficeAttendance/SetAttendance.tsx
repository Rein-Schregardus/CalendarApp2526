import { useState } from "react";

const SetAttendance = () => {
  const [inOffice, setInOffice] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const GetInOffice = async() => {
    setIsLoading(true);

    // setInOffice();
  }

  const LeaveOffice = async() => {
    setIsLoading(true);
    //fetch
  }

  const EnterOffice = async() => {
    setIsLoading(true);
    //fetch
  }

  return (
    <div className="bg-primary rounded-lg shadow-2xl">
      <p className="text-center w-full p-1 font-semibold">Set Attendance</p>
      <div className="p-1 border-t-2 border-t-secondary rounded-b-lg flex flex-col">
        <span>You are {!isLoading && inOffice? " in the office.": "outside of the office."}</span>
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