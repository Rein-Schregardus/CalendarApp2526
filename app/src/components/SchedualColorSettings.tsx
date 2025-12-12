    const saveColor = (schedualItemType: "Event" | "RoomReservation", hexCode: string) => {
        localStorage.setItem("schedualColor-" + schedualItemType, hexCode)
    }

    const getColor = (schedualItemType: "Event" | "RoomReservation"): string | null => {
        return localStorage.getItem("schedualColor-" + schedualItemType);
    }

const SchedualColorSetting = () => {

    return (
        <div className="rounded-md shadow-md pr-10 bg-secondary w-max">
            <h1 className="font-semibold">Schedual Colors</h1>
            <div className="flex items-center h-10">
                <span className="mb-2.5">Events:</span>
                <ul className="flex gap-2 items-center">
                    <li>
                        <button
                        className="w-5 h-5 rounded-full bg-[#5a7c94]"
                        onClick={() => saveColor("Event", "#5a7c94")}
                        style={
                            {width: getColor("Event") == "#5a7c94"? "1.6rem" : "1.25rem"}
                        }/>
                    </li>
                    <li>
                        <button
                        className="w-5 h-5 rounded-full bg-[#835e8f]"
                        onClick={() => saveColor("Event", "#835e8f")}
                        style={
                            {width: getColor("Event") == "#835e8f"? "1.6rem" : "1.25rem"}
                        }/>
                    </li>
                    <li>
                        <button
                        className="w-5 h-5 rounded-full bg-[#d43552]"
                        onClick={() => saveColor("Event", "#d43552")}
                        style={
                            {width: getColor("Event") == "#d43552"? "1.6rem" : "1.25rem"}
                        }/>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export {SchedualColorSetting, saveColor, getColor};