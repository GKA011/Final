import { Button, Card, CardMedia, CardContent, Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pexelsImage from '../assets/s by res.jpeg';

const Exploreby = () => {
  const navigate = useNavigate();
  const [clickedCard, setClickedCard] = useState(null); // State to track clicked card

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);


  // Dummy data
  const datas = [
    {
      id: 1,
      title: 'Explore by Restaurant',
      img_url: pexelsImage,
      EmpName: 'Explore by Restaurant',
      designation: 'Restaurants',
      empId: 'RES001'
    },
    {
      id: 2,
      title: 'Explore by Cuisine',
      img_url: 'https://www.shutterstock.com/image-photo/fast-food-unhealthy-eating-concept-600nw-2182172665.jpg',
      EmpName: 'Explore by Cuisine',
      designation: 'Cuisines',
      empId: 'CUS002'
    }
  ];

  const handleCardClick = (id) => {
    // Trigger the hover effect and delay navigation
    setClickedCard(id);
    setTimeout(() => {
      if (id === 1) {
        navigate('/restaurant');
      } else if (id === 2) {
        navigate('/cus');
      }
    }, 300); // Delay of 300ms to allow the animation to play
  };

  return (
    <Box sx={{ width: '100%', padding: '1%' }}>
      <Grid container spacing={4} justifyContent="center" marginTop={-30} >
        {datas.map((data) => (
          <Grid item xs={12} sm={6} md={4} key={data.id}>
            <Card
              sx={{
                maxWidth: 345,
                margin: 'auto',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', // Softer shadow for elegance
                borderRadius: 4,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: clickedCard === data.id ? 'scale(1.05)' : 'none', // Trigger scale on click
                boxShadow: clickedCard === data.id ? '0 12px 24px rgba(0, 0, 0, 0.2)' : '0 6px 20px rgba(0, 0, 0, 0.1)', // Shadow on click
                cursor: 'pointer', // Indicate clickability
              }}
              onClick={() => handleCardClick(data.id)} // Card is clickable now
            >
              <CardMedia
                component="img"
                image={data.img_url}
                alt={data.title}
                sx={{ height: 200, borderRadius: '4px 4px 0 0' }} // Rounded top corners
              />
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {data.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  {data.designation}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundImage: 'linear-gradient(to right, #a5076b, #660660)', // Gradient colors
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: 50, // Rounded button
                    textTransform: 'none', // Normal text case
                    '&:hover': {
                      backgroundImage: 'linear-gradient(to right, #660660, #a5076b)', // Reverse gradient on hover
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' // Hover shadow for button
                    }
                  }}
                  onClick={() => handleCardClick(data.id)} // Same handler for the button
                >
                  {data.id === 1 ? 'Explore by Restaurant' : 'Explore by Cuisine'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Exploreby;
