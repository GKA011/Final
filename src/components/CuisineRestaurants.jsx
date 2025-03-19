import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CuisineRestaurants = () => {
  const { cuisineName } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/restaurants-by-tag`, {
          params: { tag: cuisineName },
        });

        const sortingOrders = {
          "Biriyani" : ["Halais Dum Biriyani", "Paragon", "Dindugal Thalappakatti", "Barbeque Nation", "North Express", "Nagas"],
          "Fried Rice" : ["Rice & Noodles", "Wow China" , "Flame N Go", "Paragon", "Hottey Smokey"],
          "Shawarma" : ["Klub House", "Subway", "Wrap Vibes", "Chicking", "Burger King", "Taco Bell"],
          "Burger" : ["Burger King", "McDonald's", "Chicking", "KFC"],
          "Bread" : ["Vasanta Bhavan", "North Express", "Paragon", "Nagas", "Vaiga's Ootupura"],
          "Pure Veg" : ["Vasanta Bhavan", "Vaiga's Ootupura"],
          "Noodles" : ["Rice And Noodles", "Flame N Go", "Wow China", "Paragon", "Hottey Smokey"],
          "Momos" : ["Wow Momo", "Rice And Noodles"],
          "Desserts" : ["Amul Ice Creams", "Ice Cream Chef", "Baskin Robbins", "Cold Stone Creamery", "My Fryoland", "The Muffin House", "McDonald's", "Burger King"],
          "Pizza" : [ "Pizza Hut","Domino's","Pizza Ricotta"],
          "Pulao" : ["Vasanta Bhavan", "North Express", "Paragon"],   
          "Soup" : ["Rice & Noodles", "Barbeque Nation", "Wow China", "Halais Dum Biriyani",  "North Express", "Paragon", "Hottey Smokey", "Flame N Go", "Vasanta Bhavan"],
          "Kothu Paratta" : ["Dindugal Thalappakatti", "Halais"] ,
          "Sandwich" : ["Subway", "Starbucks","Costa Coffee","The Muffin House","Chai-Chai", "Klub House", "Coffee Cup", "Selfie Tea","Ovenly"],
          "Seafood" : [ "Paragon","Halais Dum Biriyani"," Dindugal Thalappakatti", "Barbeque Nation", "North Express"],
          "Tacos" : ["Taco Bell","Chicking", "Burger King"],
          "Meals" : ["Paragon", "Vasanta Bhavan", "Vaiga's Ootupura"],
          "Snacks" : ["Selfie Tea", "Chai-Chai", "Ovenly", "Vaigas Ootupura", "The Muffin House"],
          "Sizzler" : ["Hottey Smokey" ,"Wow China","Wow Momo","Vasanta Bhavan"],
          "Curd Rice" : ["Vasanta Bhavan", "Vaiga's Ootupura"],
          "Kebabs" : ["North Express", "Barbeque Nation", "Paragon"],
          "Broasted" : ["Kfc","Chicking","Burger King","Coffee Cup"],
          "Chaat" : ["North Express","Seetaphal","Barbeque Nation"],
          "Waffles" : ["Belgian Waffle"],
          "Cafe" : ["Starbucks", "Costa Coffee", "The Muffin House", "Coffee Cup"],
          "Shakes" : ["Falooda Nation", "Fruit Bae", "Seetaphal", "Frozen Bottle", "Mouzy", "Amul Ice Creams", "Coffee Cup", "Baskin Robbins", "Starbucks", "Cold Stone Creamery", "Burger King"],
          "Tea" : ["Chai-Chai", "Selfie Tea", "Vaiga's Ootupura", "Ovenly", "Vasanta Bhavan", "Halais"],
          "North Indian" : ["North Express", "Barbeque Nation"],
          "South Indian" : ["Vasanta Bhavan", "Vaiga's Ootupura", "Halais", "Dindugal Thalappakkatti"],
          "Mexican" : ["Tacobell"],
          "Chinese" : ["Rice & Noodles", "Wow Momo" , "Wow China", "Flame N Go", "Paragon"],
          "Italian" : ["Pizza Hut", "Dominoes", "Pizza Ricotta"],
          "Desserts" : ["Amul Ice Creams", "Ice Cream Chef", "Baskin Robbins"],
          "Snacks" : ["Selfie Tea", "Chai-Chai", "Ovenly"],
          "Pan Asian" : ["Flame N Go"]
        };

        let fetchedRestaurants = response.data.data;

        if (sortingOrders[cuisineName]) {
          const order = sortingOrders[cuisineName].map((name) => name.trim().toLowerCase());
          fetchedRestaurants = fetchedRestaurants.sort((a, b) => {
            const indexA = order.indexOf(a.shop_name.trim().toLowerCase());
            const indexB = order.indexOf(b.shop_name.trim().toLowerCase());
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
        }

        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [cuisineName]);

  const rotatingLogoStyle = {
    width: '75px',
    height: '75px',
    animation: 'spin 2s linear infinite',
  };

  const loadingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh', // Full-page height for centering
    textAlign: 'center', // Ensure proper alignment
  };

  const keyframesSpin = `
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  if (loading)
    return (
      <div style={loadingContainerStyle}>
        <style>{keyframesSpin}</style>
        <img
          src="https://www.hyderabad.lulumall.in/wp-content/uploads/2023/07/unnamed-removebg-preview.png"
          alt="Loading..."
          style={rotatingLogoStyle}
        />
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Restaurants offering {['Biryani', 'South Indian', 'North Indian'].includes(cuisineName) ? `${cuisineName} Cuisine` : cuisineName}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '10px' }}>
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => handleRestaurantClick(restaurant._id)}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0.5, 0.5, 0.5, 0.5)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
                height: '200px',
              }}
            >
              <img
                src={restaurant.logo}
                alt={restaurant.shop_name}
                style={{
                  width: '120px',
                  height: '100px',
                  objectFit: 'contain',
                  marginBottom: '10px',
                }}
              />
              <h3 style={{ color: 'black', margin: '0', textAlign: 'center' }}>{restaurant.shop_name}</h3>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', fontSize: '1.2em', color: '#777' }}>
            No restaurants found for this cuisine.
          </div>
        )}
      </div>
    </div>
  );
};

export default CuisineRestaurants;
