import { Line } from 'react-chartjs-2';
import { useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);



function countEventsByMonth(events) {
    const eventsByMonth = new Array(12).fill(0);

    const currentYear = new Date().getFullYear();

    events.forEach(event => {
        const startDate = new Date(event.startDate);
        const eventYear = startDate.getFullYear();

        if (eventYear === currentYear) {
            const month = startDate.getMonth();
            eventsByMonth[month]++;
        }
    });

    return eventsByMonth;
}




export default function LinesChart() {

    const [months, setMonts] = useState()

    useEffect(() => {
        const userId = Cookies.get('plan_ahead_user_id')
        const token = Cookies.get('plan_ahead_user_token')
        axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status == 200) {
                    const events = res.data
                    setMonts(countEventsByMonth(events))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    var eventsByMonth = months
    var meses = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var midata = {
        labels: meses,
        datasets: [ // Cada una de las líneas del gráfico
            {
                label: 'Events',
                data: eventsByMonth,
                tension: 0.5,
                fill: true,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointRadius: 5,
                pointBorderColor: 'rgba(255, 99, 132)',
                pointBackgroundColor: 'rgba(255, 99, 132)',
            },

        ],
    };

    var misoptions = {
        scales: {
            y: {
                min: 0
            },
            x: {
                ticks: { color: 'rgb(255, 99, 132)' }
            }
        }
    };

    return <div className='lines-chart-container'>
        <Line data={midata} options={misoptions} />
    </div>
}