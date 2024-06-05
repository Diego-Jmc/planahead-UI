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
    type: "",
    status: "",
    taskList: [],
    fileList: ""
  });

  const [formSuccess, setFormSuccess] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTask, setNewTask] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleTaskInputChange = (e, index) => {
    const newTaskList = [...formData.taskList];
    newTaskList[index] = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      taskList: newTaskList
    }));
  };

  const handleAddTask = () => {
    setFormData(prevState => ({
      ...prevState,
      taskList: [...prevState.taskList, newTask],
    }));
    setNewTask("");
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formURL = e.target.action;
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "taskList") {
        value.forEach((task, index) => {
          data.append(`taskList[${index}]`, task);
        });
      } else {
        data.append(key, value);
      }
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
          type: "",
          status: "",
          taskList: [],
          fileList: []
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

  const handleEditClick = () => {
    editMode == true ? setEditMode(false) : setEditMode(true); 
  };


  return (
    <Layout pageTitle={title}>
      <div className='min-h-screen flex flex-col'>
        <div className="m-auto row">
          <div className="col-md-6  col-sm-12">
            <h1>Event details</h1>
          </div>
          <div className='col-md-6 col-sm-12'>
            <button type="button" className="btn btn-success" onClick={handleEditClick} >
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
                    <input type="text" className="form-control" name="name" value={formData.name} placeholder="Enter Title" onChange={handleInput} disabled={!editMode} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="email">Description</label>
                    <input type="email" className="form-control" name="email" value={formData.email} aria-describedby="emailHelp" placeholder="Enter Description" onChange={handleInput} disabled={!editMode} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="type">Event Type</label>
                    <input type="text" className="form-control" name="type" value={formData.type} placeholder="Enter Event Type" onChange={handleInput} disabled={!editMode} />
                  </div>
                </div>
                <div className='col-6'>
                  <div className="form-group mt-1">
                    <label htmlFor="createdAt">Created At</label>
                    <div className="w-full max-w-xl flex flex-row gap-4">
                      <DatePicker
                        label="Event Date"
                        variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        value={formData.createdAt}
                        onChange={(date) => setFormData(prevState => ({ ...prevState, createdAt: date }))}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="status">Status</label>
                    <select className="form-control" name="status" value={formData.status} onChange={handleInput} disabled={!editMode}>
                      <option value="">Select Status</option>
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                </div>
                <hr className='mt-4'></hr>
                <div className='row mt-3'>
                  <div className='col-sm-12 col-md-6'>

                  <div className="form-group mt-1 h-75">
                    <label htmlFor="taskList">Task List</label>
                    <table className="table">
                      <tbody>
                        {formData.taskList.map((task, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={task}
                                onChange={(e) => handleTaskInputChange(e, index)}
                                disabled={!editMode}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                disabled={!editMode}
                              />
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddTask}
                                disabled={!editMode}
                              >
                                Add Task
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </div>
                  <div className='col-sm-12 col-md-6'>
                    <div className="form-group mt-1">
                    <label htmlFor="fileList">Related Files</label>
                    <textarea className="form-control" name="fileList" value={formData.fileList} placeholder="Enter File List" onChange={handleInput} disabled={!editMode} />
                  </div>
                  </div>
                  
                </div>
              </div>
              <button type="submit" className={`btn btn-primary mt-5 ${editMode ? '' : 'disabled'}`} disabled={!editMode}>Save</button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
