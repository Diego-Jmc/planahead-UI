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
    startDate: ""
  });

  const [event, setEvent] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState("");
  const [files, setFiles] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const token = Cookies.get('plan_ahead_user_token');
    if (token != null) {
      axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.status == 200) {

            setFiles(res.data.files)
            setTasks(res.data.tasks)
            setFormData({
              name: res.data.title,
              description: res.data.description,
              type: res.data.type,
              status: res.data.completed,
              startDate: new Date(res.data.startDate).toISOString().split('T')[0]
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
          description: "",
          type: "",
          status: "",
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
          <div className="col-md-6 col-sm-12">
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
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      placeholder="Enter Description"
                      onChange={handleInput}
                      rows={4}
                      spellCheck={false}
                    />
                  </div>

                  <div className="form-group mt-1">
                    <label htmlFor="type">Tipo de evento</label>
                    <input type="text" className="form-control" name="type" value={formData.type} placeholder="Event type" onChange={handleInput} />
                  </div>
                  <div className="form-group mt-1">
                    <label htmlFor="createdAt">Created At</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInput}
                    />
                  </div>

                </div>
                <div className='col-6'>
                  <div className="form-group mt-1">
                    <label htmlFor="status">Status</label>
                    <select className="form-control" name="status" value={formData.status} onChange={handleInput}>
                      {
                        formData.status == true ? <option value="complete" defaultChecked="true" >Complete</option> : <option value="incomplete">Incomplete</option>
                      }

                      {
                        formData.status == false ? <option value="complete" >Complete</option> : <option value="incomplete" defaultChecked="true" >Incomplete</option>
                      }

                    </select>
                  </div>
                  <div className="form-group mt-1 h-75">
                    <label htmlFor="taskList">Task List</label>
                    {
                      tasks.length !== 0 ?
                        tasks.map((task, index) => (
                          <div key={index}>
                            {task.name}
                          </div>
                        )) :
                        <p>No tasks for this event</p>
                    }

                  </div>
                </div>
                <div className='row mt-3'>
                  <div className="form-group mt-1">
                    <label htmlFor="relatedFiles">Related Files</label>
                    {
                      files.length !== 0 ?
                        files.map((file, index) => (
                          <FileDisplay key={index} url={file.url} nombre={file.filename} />
                        )) :
                        <p>No files for this event</p>
                    }

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
