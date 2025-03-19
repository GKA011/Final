import React, { useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useLocation } from 'react-router-dom';
import BugReportIcon from '@mui/icons-material/BugReport';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HomeIcon from '@mui/icons-material/Home';

export default function Footer() {
  const [value, setValue] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update selected value based on the current route
  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: '#21005D',
        boxShadow: '0px -2px 5px rgba(0.5, 0.5, 0.5, 0.5)',
        zIndex: 10,
        borderTop: '1px solid #e0e0e0',
      }}
      value={value}
      onChange={handleChange}
    >

        <BottomNavigationAction
        label="Home"
        value="/"
        icon={<HomeIcon />}
        sx={{
          color: value === '/' ? '#FFFFFF' : '#FFFFFF', // Change color when selected
        }}
      />

      <BottomNavigationAction
        label="Navigation"
        value="/navi"
        icon={<LocationOnIcon />}
        sx={{
          color: value === '/shops' ? '#FFFFFF' : '#FFFFFF', // Change color when selected
        }}
      />
      <BottomNavigationAction
        label="Restaurants"
        value="/restaurant"
        icon={<RestaurantIcon />}
        sx={{
          color: value === '/restaurant' ? '#FFFFFF' : '#FFFFFF', // Change color when selected
        }}
      />
      <BottomNavigationAction
        label="Cuisines"
        value="/cus"
        icon={<FastfoodIcon />}
        sx={{
          color: value === '/cus' ? '#FFFFFF' : '#FFFFFF', // Change color when selected
        }}
      />
      
    </BottomNavigation>
  );
}
