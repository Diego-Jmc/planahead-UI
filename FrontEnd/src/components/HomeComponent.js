import React, { useEffect } from 'react'
import Layout from './Layuot'
import isUserAuth from '../utils/auth'
import { useRouter } from 'next/navigation'
import LinesChart from './LinesChart'
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
export default function HomePage({ title }) {

    const router = useRouter()

    const [completedEvents,setCompletedEvents] = useState(0)
    const [uncompletedEvents,setUncompletedEvents] = useState(0)
    const [totalEvents,setTotalEvents] = useState(0)
    const [eventList,setEventList] = useState()

    function getPorcenteOfCompletedEvents(){
        const porcentage =  ( completedEvents / totalEvents ) * 100 
        return porcentage.toFixed(0)
    }

    useEffect(() => {

        if (!isUserAuth()) {
            console.log('user is not authenticated')
            router.push('/login')
        } else {

            const userId = Cookies.get('plan_ahead_user_id')
            const token = Cookies.get('plan_ahead_user_token')  
            axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/users/${userId}`,{  headers: {
                'Authorization': `Bearer ${token}`
              }})
            .then(res=>{
                if(res.status == 200){
                    const events = res.data
                    setCompletedEvents(events.filter(e=> e.completed).length)
                    setUncompletedEvents(events.filter(e=> !e.completed).length)
                    setTotalEvents(events.length)
                    setEventList(events)

                }
            })
            .catch(err=>{
                console.log(err)
            })

            
        }

    }, [isUserAuth,setEventList]);


    return (
        <Layout pageTitle={title}>

            <div class="container-fluid main-container-home">

                <div class="row cards-container" >

                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-primary shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            Completed Events</div>
                                        <div class="h5 mb-0 font-weight-bold text-gray-800">{completedEvents}</div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6 mb-4">
                            <div class="card border-left-warning shadow h-100 py-2">
                                <div class="card-body">
                                    <div class="row no-gutters align-items-center">
                                        <div class="col mr-2">
                                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                Uncomplete Events</div>
                                            <div class="h5 mb-0 font-weight-bold text-gray-800">{uncompletedEvents}</div>
                                        </div>
                                        <div class="col-auto">
                                            <i class="fas fa-comments fa-2x text-gray-300"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    <div class="col-xl-3 col-md-6 mb-4">
                        <div class="card border-left-info shadow h-100 py-2">
                            <div class="card-body">
                                <div class="row no-gutters align-items-center">
                                    <div class="col mr-2">
                                        <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Total Events : {totalEvents}
                                        </div>
                                        <div class="row no-gutters align-items-center">
                                            <div class="col-auto">
                                                <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">{getPorcenteOfCompletedEvents()}%</div>
                                            </div>
                                            <div class="col">
                                                <div class="progress progress-sm mr-2">
                                                    <div class="progress-bar bg-info" role="progressbar"
                                                        style={{ width: `${getPorcenteOfCompletedEvents()}%` }} aria-valuenow="50" aria-valuemin="0"
                                                        aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="row charts-flex-container">
                    <div>

                        <div class="card shadow mb-4">

                            <div
                                class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                <h6 class="m-0 font-weight-bold text-primary">Events Monthly Overview</h6>
                                <div class="dropdown no-arrow">
                                    <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                    </a>
                                </div>
                            </div>

                            <div class="card-body">
                                <div class="chart-area">


                                    <LinesChart></LinesChart>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3">
                                <h6 class="m-0 font-weight-bold text-primary">Top categories</h6>
                            </div>
                            <div className="card-body">
              
                                <h4 className="small font-weight-bold">
                                    Seminario <span className="float-right">{eventList.filter(e=> e.type == "Seminario").length}</span>
                                </h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '100%' }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h4 className="small font-weight-bold">
                                    Taller <span className="float-right">{eventList.filter(e=> e.type == "Taller").length}</span>
                                </h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '100%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h4 className="small font-weight-bold">
                                    Jornada <span className="float-right">{eventList.filter(e=> e.type == "Jornada").length}</span>
                                </h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar" role="progressbar" style={{ width: '100%' }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h4 className="small font-weight-bold">
                                    Conferencia <span className="float-right">{eventList.filter(e=> e.type == "Conferencia").length}</span>
                                </h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '100%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            
                            </div>

                        </div>

                    </div>

                </div>


                <div className='row d-flex' >


                </div>

            </div>

        </Layout>
    );
}

