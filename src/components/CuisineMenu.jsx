import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CuisineMenu = () => {
  const { restaurantId, cuisineName } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`https://backend-05of.onrender.com/api/restaurant/${restaurantId}/menu`, {
          params: { tag: cuisineName },
        });
        
        // Check if response contains expected data
        if (response.data && response.data.restaurant && response.data.menuItems) {
          setRestaurant(response.data.restaurant);
          setMenuItems(response.data.menuItems);
        } else {
          console.warn("Data format unexpected:", response.data);
          setError("Unexpected data format received.");
        }
      } catch (error) {
        // Log the error details to diagnose
        console.error("Error fetching menu:", error.message, error.response?.data);
        setError("Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId, cuisineName]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const primaryColor = '#6c757d';
  const secondaryColor = '#fdfdfd';

  return (
    <div style={{ padding: '20px', fontFamily: "'Poppins', sans-serif" }}>
      {restaurant && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2.5em', color: '#000', fontWeight: '700' }}>{restaurant.shop_name}</h1>
          <img
            src={restaurant.logo}
            alt={restaurant.shop_name}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.3s ease',
              objectFit: 'contain',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      )}

      <h2 style={{ color: '#000', fontSize: '2em', textAlign: 'center', marginBottom: '30px' }}>
        Menu - {cuisineName} Cuisine
      </h2>

      <div
        style={{
          border: `2px solid ${primaryColor}`,
          borderRadius: '15px',
          padding: '20px',
          backgroundColor: secondaryColor,
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
          textAlign: 'left',
          maxWidth: '800px',
          margin: '0 auto', // Center the card
        }}
      >
        <h3 style={{ fontSize: '1.8em', color: '#000', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '10px' }}>
          {cuisineName} Dishes
        </h3>

        <ul style={{ listStyleType: 'none', padding: '20px 0', margin: 0 }}>
          {menuItems.map((item, index) => (
            <li
              key={item._id}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid #ddd',
                fontSize: '1.2em',
                color: '#333',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CuisineMenu;
