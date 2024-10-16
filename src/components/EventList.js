import React, { useState, useEffect, useContext, useMemo } from "react";
import AuthContext from "./AuthContext";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Fetch from the correct path
    fetch("/events.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch events.");
        setLoading(false);
      });
  }, []);
  

  const handleBooking = (eventId) => {
    if (!isAuthenticated) {
      alert("Please log in to book tickets.");
      return;
    }

    setEvents(
      events.map((event) =>
        event.id === eventId && event.availableSeats > 0
          ? { ...event, availableSeats: event.availableSeats - 1 }
          : event
      )
    );
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? event.category === selectedCategory : true)
  );

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Comedy">Comedy</option>
          <option value="Circus">Circus</option>
          <option value="Car Race">Car Race</option>
        </select>
      </div>

      {paginatedEvents.map((event) => (
        <div key={event.id} className="event-card">
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p>Category: {event.category}</p>
          <p>Date: {event.date}</p>
          <p>Price: ${event.price}</p>
          <p>Available Seats: {event.availableSeats}</p>
          <button
            onClick={() => handleBooking(event.id)}
            disabled={event.availableSeats === 0}
          >
            {event.availableSeats > 0 ? "Book Ticket" : "Fully Booked"}
          </button>
        </div>
      ))}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
