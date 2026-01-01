type AttendanceTag = {
  isPresent: boolean;
}

const AttendanceTag = ({isPresent}: AttendanceTag) => {
  return (
    <p
      className=" rounded-md w-18 p-1 text-center text-primary inline font-semibold leading-[2]"
      style={{backgroundColor: isPresent?"#65943b": "oklch(47% 0.157 37.304)"}}>
        {isPresent? "present" : "absent"}
    </p>
  )
}

export default AttendanceTag;