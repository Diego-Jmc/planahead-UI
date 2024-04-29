import React, { useState, useEffect } from 'react';
import Layout from './Layuot'
import { Modal, Button, Form } from 'react-bootstrap';
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";


export default function CalendarPage({ title }) {
    const [showModal, setShowModal] = useState(false);
    const [eventData, setEventData] = useState({
      title: '',
      start: '',
      end: ''
    });
    const [eventList, setEventList] = useState([]);
  
    useEffect(() => {
      fetchEvents();
    }, []);
  
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/event/getAllPopulated'); // Corrected fetch function
        if (response.ok) {
          const data = await response.json();
          setEventList(data);
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
      // Add event to the event list
      setEventList([...eventList, eventData]);
      // Close the modal after submission
      setShowModal(false);
      // Reset form data
      setEventData({
        title: '',
        start: '',
        end: ''
      });
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
      // Reset form data when modal closes
      setEventData({
        title: '',
        start: '',
        end: ''
      });
    };

    return (
        <Layout
            pageTitle={title}
        >
            <div className=" mx-3 my-3">
            <div className="row justify-content-end mt-5">
                <div className="mb-5 mb-xl-0 col-xl-3 ">
                <div className="shadow card">
                    <div class="card-body">
                    <h2>Today's List</h2>
                    <ul>
                        {eventList.map((event, index) => (
                        <li key={index}>
                            {event.title} - {event.start} to {event.end}
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                <div class="shadow card mt-3 h-100 w-100 d-inline-block">
                    <div class="card-body">
                    <ul>
                        {eventList.map((event, index) => (
                        <li key={index}>
                            {event.title} - {event.start} to {event.end}
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
                <div className="mb-5 mb-xl-0 col-xl-9">
                <div class="shadow card h-100  w-100 d-inline-block">
                    <div class="card-body">
                    <Calendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        headerToolbar={{
                        left: 'prev,today,next addEvent',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        customButtons={{
                        addEvent: {
                            text: 'add event',
                            click: () => setShowModal(true)
                        }
                        }}
                        initialView="dayGridMonth"
                        events={eventList} // Set events from eventList
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
    )
}
