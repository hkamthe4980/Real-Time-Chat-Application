import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GetDataApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 console.log(data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://api.quotable.io/random',{
            proxy:false
        })
        setData(response.data);
       
      } catch (err) {
        setError(err.message || 'An error occurred while fetching the quote.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading quote...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

 return (
    
  <div className="max-w-xl mx-auto mt-8 p-6 rounded-lg  bg-white">
      
    {data && (
      <>
        <blockquote className="text-xl leading-relaxed mb-4 italic text-gray-800">
          "{data.content}"
        </blockquote>

        <p className="text-right font-bold text-gray-600 mb-4">
          — {data.author}
        </p>

        {/* {data.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-pink-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </>
    )}
  </div>
);

}

export default GetDataApi;
