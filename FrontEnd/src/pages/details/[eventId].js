import DetailsPage from '../../components/DetailsComponent'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function FullDetailsPage() {

  const router = useRouter()

  useEffect(()=>{
  },[[router.query.eventId]])


  return (
    <div>
      <DetailsPage title="Event Details"  eventId={router.query.eventId} />
    </div>
   
  )
}
