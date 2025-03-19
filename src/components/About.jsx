import React, { useEffect } from "react";

const HomePage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);

  const styles = {
    homepage: {
      fontFamily: "Arial, sans-serif",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "#fff",
      margin: "0",
      padding: "0",
      width: "100%",
      minHeight: "100vh",
    },
    unifiedSection: {
      position: "relative",
      width: "100%",
      textAlign: "center",
      color: "white",
      overflow: "hidden",
      height: "100vh", // Full screen height
    },
    unifiedImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover", // Ensures the image covers the section
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: "-1", // Places the image behind the text and button
    },
    unifiedOverlay: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    headerTitle: {
      fontSize: "clamp(3rem, 6vw, 4rem)", // Large and responsive font size
      marginBottom: "20px",
      fontWeight: "bold",
    },
    headerSubtitle: {
      fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
      marginBottom: "30px",
    },
    ctaButton: {
      marginTop: "20px",
      padding: "15px 30px",
      backgroundColor: "#4caf50",
      color: "white",
      border: "none",
      borderRadius: "5px",
      fontSize: "1.2em",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    ctaButtonHover: {
      backgroundColor: "#388e3c",
    },
    featuresSection: {
      padding: "50px 10px",
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
    },
    feature: {
      margin: "40px auto",
      maxWidth: "800px",
    },
    featureImage: {
      width: "100%",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    },
    featureTitle: {
      fontSize: "1.8em",
      color: "#21005D",
      margin: "10px 0",
    },
    featureDescription: {
      fontSize: "1em",
      color: "#000000",
      marginBottom: "30px",
    },
  };

  return (
    <div style={styles.homepage}>
      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        {/* Feature 1 */}
        <div style={styles.feature}>
          <img
            src="https://i.ytimg.com/vi/O7CAWvEd2GY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBV8ml7JY2M_A2fDrp2mDCCXm2MpQ"
            alt="Easy Navigation"
            style={styles.featureImage}
          />
          <h2 style={styles.featureTitle}>Easy Navigation</h2>
          <p style={styles.featureDescription}>
            Find your way effortlessly through Lulu Mall with our advanced
            navigation system. Never get lost while exploring your favorite
            brands and stores.
          </p>
        </div>

        {/* Feature 2 */}
        <div style={styles.feature}>
          <img
            src="https://insights.shijigroup.com/wp-content/uploads/2021/03/abillion-F0e3AdcwVbM-unsplash.jpg"
            alt="Restaurant Menus"
            style={styles.featureImage}
          />
          <h2 style={styles.featureTitle}>Search Restaurant Menus</h2>
          <p style={styles.featureDescription}>
            Save time by browsing menus from various restaurants in the mall.
            Plan your meals ahead after a day of shopping.
          </p>
        </div>

        {/* Feature 3 */}
        <div style={styles.feature}>
          <img
            src="https://img.freepik.com/premium-vector/premium-flat-vector-select-food_203633-8037.jpg"
            alt="Cuisine Search"
            style={styles.featureImage}
          />
          <h2 style={styles.featureTitle}>Cuisine-Wise Search</h2>
          <p style={styles.featureDescription}>
            Craving a specific dish? Quickly find out which restaurant offers it
            and make your dining experience seamless.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
