import { useState } from "react";

const AdvancedOptions = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [attendees, setAttendees] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    // Simulate fetch, replace with real API
    const sampleData = ["alice@example.com", "bob@example.com", "charlie@example.com"];
    setResults(sampleData.filter((x) => x.includes(value.toLowerCase())));
  };

  const addAttendee = (email: string) => {
    if (!attendees.includes(email)) {
      setAttendees([...attendees, email]);
    }
    setQuery("");
    setResults([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm">Advanced Options</h3>

      <label className="text-xs font-medium">Add Attendees</label>
      <input
        type="text"
        placeholder="Name or email"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 rounded w-full" // !Color!
      />

      {/* Search results */}
      {results.length > 0 && (
        <div className="border rounded max-h-40 overflow-y-auto bg-white shadow-sm"> {/* !Color! */}
          {results.map((r) => (
            <div
              key={r}
              className="p-2 hover:bg-gray-100 cursor-pointer" // !Color!
              onClick={() => addAttendee(r)}
            >
              {r}
            </div>
          ))}
        </div>
      )}

      {/* Selected attendees */}
      {attendees.length > 0 && (
        <div className="flex flex-col gap-1 mt-2">
          {attendees.map((a) => (
            <div
              key={a}
              className="flex justify-between items-center bg-gray-100 p-1 px-2 rounded" // !Color!
            >
              <span className="text-xs">{a}</span>
              <button
                onClick={() => setAttendees(attendees.filter((x) => x !== a))}
                className="text-red-500 text-xs" // !Color!
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedOptions;
