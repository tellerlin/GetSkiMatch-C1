// pages/resort.tsx
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';

export default function ResortDetailPage() {
  const [resort, setResort] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get resort ID from URL
    const resortId = router.query.id;

    // Fetch resort details from API
    const fetchResort = async () => {
      const response = await fetch(`https://ski-query-worker.3we.org/resort?id=${resortId}`);
      const data = await response.json();
      setResort(data);
    };

    if(resortId){
        fetchResort();
    }
  }, [router.query.id]);

  if (!resort) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{resort.resort.name}</h1>
      {/* ... display other resort details ... */}
      <h2>Current Weather</h2>
        <p>{resort.currentWeather.weather_description}</p>
      {/* ... display weather information ... */}
        <button onClick={()=> router.back()}>Go Back</button>
    </div>
  );
}
