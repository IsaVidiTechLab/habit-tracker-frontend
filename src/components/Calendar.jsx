import React, { useState } from 'react';
import '../style/calendar.css';

const Calendar = () => {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(null);
  
    const getFormattedDate = (date) => {
      return date.getDate();
    };
  
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date);
    }
  
    const handleDateClick = (date) => {
      setSelectedDate(date);
    };
  
    return (
      <div className="calendar">
        {days.map((date, index) => (
          <div
            key={index}
            className={`day-container ${
              date.toDateString() === today.toDateString() ? 'today' : ''
            } ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            <div className="weekday">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="date-circle">{getFormattedDate(date)}</div>
          </div>
        ))}
      </div>
    );
};

export default Calendar;