import Layout from './Layuot'
import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Cookies from 'js-cookie'
import axios from 'axios'
import FileDisplay from './FileDisplay'

export default function DetailsPage({ title, eventId }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    status: "",
    startDate: "",
    taskList: [] // Initialize taskList as an empty array
  });

  const [isLoading, setIsLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [newTask, setNewTask] = useState("");


  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false)
  }
  
  useEffect(() => {
    const token = Cookies.get('plan_ahead_user_token');
    if (token != null) {
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status === 200) {
            setFiles(res.data.files);
            setFormData({
              name: res.data.title,
              description: res.data.description,
              type: res.data.type,
              status: res.data.completed,
              startDate: new Date(res.data.startDate).toISOString().split('T')[0],
              taskList: [] // Initialize taskList as an empty array
            });
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.log('Algo ocurrió');
          setIsLoading(false);
        });
    }
  }, [eventId]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const saveFiles = async () => {
    const token = Cookies.get('plan_ahead_user_token');
    if (token != null) {
      const data = new FormData();
      selectedFiles.forEach(file => {
        data.append('files', file);
        data.append('filename', file.name); 
        data.append('eventId', eventId);
      });
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/files`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Files uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };
  if (isLoading) {
    return <p>Cargando...</p>
  }


  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
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
    if (newTask.trim() !== "") {
      setFormData(prevState => ({
        ...prevState,
        taskList: [...prevState.taskList, newTask]
      }));
      setNewTask("");
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!editMode) return; 

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
          description: "",
          type: "",
          status: "",
          startDate: "",
          taskList: []
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

  function handleDelete(){
    setShowConfirmationModal(true)

  }

  function deleteEvent(){
    const token = Cookies.get('plan_ahead_user_token');
    axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status == 200) {
            router.push('/calendar')
        }
      })
      .catch(err => {
        console.log('Algo ocurrió');
        setIsLoading(false);
      });
  }

  return (
    <Layout pageTitle={title}>
      <div className='min-h-screen flex flex-col'>
        <div className="m-auto row">
          <div className="col-md-6 col-sm-12">
            <h1>Event details</h1>
          </div>
          <div className='col-md-6 col-sm-12'>
            <button type="button" className="btn btn-success" onClick={toggleEditMode}>
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
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      placeholder="Enter Title"
                      onChange={handleInput}
                      disabled={!editMode} // Disable input based on edit mode
                    />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      placeholder="Enter Description"
                      onChange={handleInput}
                      rows={4}
                      spellCheck={false}
                      disabled={!editMode} // Disable textarea based on edit mode
                    />
                  </div>
                </div>
                <div className='col-6'>
                  <div className="form-group mt-1">
                    <label htmlFor="type">Type of event</label>
                    <input
                      type="text"
                      className="form-control"
                      name="type"
                      value={formData.type}
                      placeholder="Event type"
                      onChange={handleInput}
                      disabled={!editMode} // Disable input based on edit mode
                    />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInput}
                      disabled={!editMode} // Disable input based on edit mode
                    />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="status">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleInput}
                      disabled={!editMode} // Disable select based on edit mode
                    >
                      <option value="complete">Complete</option>
                      <option value="incomplete">Incomplete</option>
                    </select>
                  </div>
                </div>
              </div>
              <hr className='mt-4'></hr>
              <div className='row'>
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
                                className="btn btn-success"
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
                    <br></br>
                    {editMode &&
                      <div>
                        <input
                          type="file"
                          className="form-control-file mt-2"
                          name="fileList"
                          multiple
                          onChange={handleFileChange}
                        /> <br></br>
                        {selectedFiles.length > 0 && (
                          <button className="btn btn-success mt-2" onClick={saveFiles}>
                            Upload Files
                          </button>
                        )}
                      </div>
                    }
                    {files.length !== 0 ? (
                      files.map((file, index) => (
                        <FileDisplay key={index} url={file.url} nombre={file.filename} />
                      ))
                    ) : (
                      <p>No files for this event</p>
                    )}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-5" disabled={!editMode}>
                Save {/* Enable Save button only in edit mode */}
              </button>
            </form>
          )}

        </div>
      </div>


      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
          <h2>Do you want to delete the event?</h2>
          <p>You cannot undo this action!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteEvent}>
              Delete event
            </Button>
          </Modal.Footer>
        </Modal>

    </Layout>
  );
}
