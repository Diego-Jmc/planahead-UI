import React, { useState, useEffect } from 'react';
import Layout from './Layuot'
import { Modal, Button, Form } from 'react-bootstrap';
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/navigation'
import isUserAuth from '../utils/auth'
import Cookies from "js-cookie"

export default function CalendarPage({ title }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const [todayEvents, setTodayEvents] = useState([]);
  const [eventData, setEventData] = useState({
    title: '',
    start: '',
    end: ''
  });
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    if (!isUserAuth()) {
      console.log('user is not authenticated');
      router.push('/login');
    } else {
      fetchEvents();
      console.log('user is authenticated');
    
    const today = new Date();
    const filteredEvents = eventList.filter(event => {
      const eventDate = new Date(event.start);
      return (
        today.getFullYear() === eventDate.getFullYear() &&
        today.getMonth() === eventDate.getMonth() &&
        today.getDate() === eventDate.getDate()
      );
    });
    setTodayEvents(filteredEvents);
    }
  }, [eventList]);

  const getEventColor = (eventType) =>{
    switch (eventType) {
      case 'Conferencia':
        return '#097969';
      case 'Taller':
        return '#00A36C';
      case 'Seminario':
        return '#088F8F';
      default:
        return '#097969';
    }
  }

  const fetchEvents = async () => {
    try {
      const token = Cookies.get('plan_ahead_user_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const transformedEvents = data.map(event => ({
          title: event.title,
          start: event.startDate, // Use startDate from your API response
          end: event.startDate, // Assuming you have an endDate field in your API response
        }));
        setEventList(transformedEvents);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
  };

  const handleFormSubmit = () => {
    setEventList([...eventList, eventData]);
    setShowModal(false);
    setEventData({
      title: '',
      start: '',
      end: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventData({
      title: '',
      start: '',
      end: ''
    });
  };

  const handleEventClick = (eventClickInfo) => {
    // Redirect to details page with event details
    router.push(`/details/${eventClickInfo.event.id}`);
  };

  return (
    <Layout pageTitle={title}>
      <div className="mx-3 my-3">
        <div className="row justify-content-end mt-5">
          <div className="mb-5 mb-xl-0 col-xl-3">
            <div className="shadow card h-100">
              <div className="card-body ">
                <h2>Today's List</h2>
                <ul>
                  {eventList.filter(event => {
                    // Get today's date
                    const today = new Date('2024-01-19T10:00:00.000Z');
                    // Get event's date
                    const eventDate = new Date(event.start);
                    // Compare dates (year, month, and day)
                    return (
                      today.getFullYear() === eventDate.getFullYear() &&
                      today.getMonth() === eventDate.getMonth() &&
                      today.getDate() === eventDate.getDate()
                    );
                  }).map((event, index) => (
                    <li key={index}>
                      {event.title}
                      <br />
                      {event.start} to {event.end}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
          <div className="mb-5 mb-xl-0 col-xl-9">
            <div className="shadow card h-100  w-100 d-inline-block">
              <div className="card-body">
                <Calendar
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  headerToolbar={{
                    left: 'prev,today,next addEvent',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  customButtons={{
                    addEvent: {
                      text: 'Add event',
                      click: () => setShowModal(true)
                    }
                  }}
                  initialView="dayGridMonth"
                  events={eventList}
                  eventClick={handleEventClick} // Handle event click
                />
              </div>
            </div>
          </div>
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formStart">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="start"
                  value={eventData.start}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEnd">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="end"
                  value={eventData.end}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              Save Event
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
}