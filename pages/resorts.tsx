// pages/resorts.tsx
import { useState, useEffect, FormEvent } from "react";
import { useRouter } from 'next/navigation';
  
export default function ResortsPage() {
    const [resorts, setResorts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        country_code: "",
        region: "",
        name: "",
        total_slopes_min: "",
        total_slopes_max: "",
        snow_parks_min: "",
        snow_parks_max: "",
        ski_lifts_min: "",
        ski_lifts_max: "",
        adult_day_pass_min: "",
        adult_day_pass_max: "",
        night_skiing: "",
        season_start: "",
        season_end: "",
    });
    const [countries, setCountries] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchResorts = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const queryParams = new URLSearchParams(Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '') 
                )).toString();

                
                const apiUrl = `https://ski-query-worker.3we.org/resorts?${queryParams}`;

                console.log("Fetching from:", apiUrl);

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setResorts(data.resorts);
                setPagination(data.pagination);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResorts();
    }, [filters]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://ski-query-worker.3we.org/countries');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchCountries();
    }, []);

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const queryParams = new URLSearchParams(Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '') 
        )).toString();

        router.push(`/resorts?${queryParams}`); 
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Ski Resorts</h1>

            {/* Filter Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Input fields for filters */}
                <div className="mb-4">
                    <label htmlFor="country_code" className="block text-gray-700 text-sm font-bold mb-2">Country:</label>
                    <select 
                        id="country_code" 
                        name="country_code" 
                        value={filters.country_code}
                        onChange={handleInputChange} 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">All Countries</option>
                        {countries.map((country) => (<option key={country.country_code} value={country.country_code}>{country.name}</option>))}
                    </select>
                </div>
                {/* ... other filter input fields ... */}
                
                {/* Region */}
                <div className="mb-4"> 
                    <label htmlFor="region" className="block text-gray-700 text-sm font-bold mb-2">Region:</label>
                    <input type="text" id="region" name="region" value={filters.region} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input type="text" id="name" name="name" value={filters.name} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                {/* Total Slopes */}
                <div className="mb-4">
                    <label htmlFor="total_slopes_min" className="block text-gray-700 text-sm font-bold mb-2">Min Slopes:</label>
                    <input type="number" id="total_slopes_min" name="total_slopes_min" value={filters.total_slopes_min} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="total_slopes_max" className="block text-gray-700 text-sm font-bold mb-2">Max Slopes:</label>
                    <input type="number" id="total_slopes_max" name="total_slopes_max" value={filters.total_slopes_max} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                {/* ... (Add other filter fields similarly) ... */}

                {/* Night Skiing */}
                <div className="mb-4 flex items-center">
                    <input type="checkbox" id="night_skiing" name="night_skiing" checked={filters.night_skiing === 'true'} onChange={handleInputChange} className="mr-2" />
                    <label htmlFor="night_skiing" className="block text-gray-700 text-sm font-bold mb-2">Night Skiing</label>
                </div>

                {/* Season Start/End */}
                <div className="mb-4">
                    <label htmlFor="season_start" className="block text-gray-700 text-sm font-bold mb-2">Season Start:</label>
                    <input type="text" id="season_start" name="season_start" value={filters.season_start} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="season_end" className="block text-gray-700 text-sm font-bold mb-2">Season End:</label>
                    <input type="text" id="season_end" name="season_end" value={filters.season_end} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>


                {/* Submit Button */}
                <div className="col-span-full sm:col-span-2 md:col-span-1 lg:col-span-1"> {/* Adjust col-span for responsiveness */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Search
                    </button>
                </div>
            </form>

            <div>
                {/* Loading or Error */}
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading...</span>
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-center">{error.message}</div>
                )}

                {/* Resorts Grid */}
                {!isLoading && !error && resorts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {resorts.map((resort) => (
                            <div key={resort.resort_id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                                <a href={`/resort?id=${resort.resort_id}`} className="p-4 block"> 
                                    <h2 className="text-lg font-medium hover:text-blue-500">{resort.name}</h2>
                                    <p className="text-gray-500 text-sm">{resort.country_code}</p>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && pagination && resorts.length > 0 && pagination.total_pages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2 flex-wrap"> 
                        <button
                            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:shadow-outline"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                            disabled={pagination.page === pagination.total_pages}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:shadow-outline"
                        >
                            Next
                        </button>
                        <span className="mx-2 text-gray-600">Page {pagination.page} of {pagination.total_pages}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
