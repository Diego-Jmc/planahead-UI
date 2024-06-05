import Layout from './Layuot'
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";

export default function DetailsPage({ title }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formURL = e.target.action;
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(formURL, {
        method: "POST",
        body: data,
        headers: {
          accept: "application/json",
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        setFormSuccess(true);
        setFormSuccessMessage(responseData.submission_text);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Layout pageTitle={title}>
      <div className='min-h-screen flex flex-col'>
        <div className="m-auto row">
          <div className="col-md-6  col-sm-12">

            <h1>Event details</h1>
          </div>
          <div className='col-md-6 col-sm-12'>
            <button type="button" className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M4.5 13.793l-1.5 1.5v.707h.707l1.5-1.5-.707-.707zm9-9l-11 11-3 1 1-3 11-11 3-1-1 3zm-10.586 9.378l9-9 .707.707-9 9-.707-.707z" />
              </svg>
            </button>

          </div>
          {formSuccess ? (
            <div>{formSuccessMessage}</div>
          ) : (
            <form
              method="POST"
              action="https://www.formbackend.com/f/664decaabbf1c319"
              onSubmit={submitForm}>
              <div className='row'>
                <div className='col-6'>
                  <div className="form-group mt-1">
                    <label htmlFor="name">Title</label>
                    <input type="text" className="form-control" name="name" value={formData.name} placeholder="Enter Title" onChange={handleInput} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="email">Description</label>
                    <input type="email" className="form-control" name="email" value={formData.email} aria-describedby="emailHelp" placeholder="Enter Description" onChange={handleInput} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="email">Tipo de evento</label>
                    <input type="email" className="form-control" name="type" placeholder="Event type" onChange={handleInput} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="message">Created At</label>
                    <div className="w-full max-w-xl flex flex-row gap-4">
                      <DatePicker
                        label="Event Date"
                        variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        defaultValue={now(getLocalTimeZone())}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className="form-group mt-1">
                    <label htmlFor="status">Status</label>
                    <select className="form-control" name="status" value={formData.status} onChange={handleInput}>
                      <option value="">Select Status</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                  <div className="form-group mt-1 h-75">
                    <label htmlFor="message">Task List</label>
                    <input type="text" className="form-control h-100" name="name" placeholder="Task List here" onChange={handleInput} />
                    {/* Render your list of tasks here */}
                  </div>
                </div>
                <div className='row mt-3'>
                  <div className="form-group mt-1">
                    <label htmlFor="message">Related Files</label>
                    <input type="text" className="form-control" name="name" placeholder="File List here" onChange={handleInput} />
                    {/* Render your list of related files here */}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-5">Save</button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

