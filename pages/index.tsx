// pages/index.tsx
import { useState, useEffect } from "react";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [minSlopes, setMinSlopes] = useState("");
  const [maxSlopes, setMaxSlopes] = useState("");
  // ... other state variables for filters

  useEffect(() => {

    // Fetch countries from API
    const fetchCountries = async () => {
      const response = await fetch("https://ski-query-worker.3we.org/countries");
      const data = await response.json();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  const handleSearch = () => {
    // Build query parameters string
    const queryParams = new URLSearchParams();
    if (selectedCountry) queryParams.
append("country_code", selectedCountry);
    if (selectedRegion) queryParams.append("region", selectedRegion);
    if (minSlopes) queryParams.append("total_slopes_min", minSlopes);
    if (maxSlopes) queryParams.append("total_slopes_max", maxSlopes);
    // ... other parameters

    // Navigate to listing page with parameters
    window.location.href = `/resorts?${queryParams.toString()}`;
  };

  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}>
      <h1>Find Your Perfect Ski Resort</h1>
      {/* Filter inputs */}
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
      >
        <option value="">Select a Country</option>
        {countries.map((country) => (
          <option key={country.country_code} value={country.country_code}>
            {country.name}
          </option>
        ))}
      </select>
        <input type="number" placeholder="Min Slopes" onChange={(e) => setMinSlopes(e.target.value)}/>
        <input type="number" placeholder="Max Slopes" onChange={(e) => setMaxSlopes(e.target.value)}/>
      <button onClick={handleSearch}>Find Resorts</button>
    </div>
  );
}
