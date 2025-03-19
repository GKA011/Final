import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FoodMenuAndCuisine = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const cardRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.zoom = "90%"; // Set zoom level to 80%
    return () => {
      document.body.style.zoom = "100%"; // Reset on component unmount
    };
  }, []);

  const foodItems = [
    { name: "Biriyani", image: "https://static.vecteezy.com/system/resources/previews/041/856/170/non_2x/ai-generated-delicious-dum-handi-biryani-in-bowl-isolated-on-transparent-background-free-png.png" },
    { name: "Fried Rice", image: "https://static.vecteezy.com/system/resources/thumbnails/047/601/517/small/freshly-prepared-chicken-fried-rice-with-vegetables-in-a-brown-bowl-cut-out-stock-png.png" },
    { name: "Shawarma", image: "https://pngimg.com/d/shawarma_PNG3.png" },
    { name: "Burger", image: "https://png.pngtree.com/png-clipart/20230414/original/pngtree-isolated-burger-on-transparent-background-png-image_9055072.png" },
    { name: "Bread", image: "https://png.pngtree.com/png-clipart/20231020/original/pngtree-kulcha-naan-vegetarian-cuisine-roti-indian-cuisine-png-image_13375393.png" },
    { name: "Pure Veg", image: "https://static.vecteezy.com/system/resources/previews/047/589/949/non_2x/delicious-south-indian-thali-png.png" },
    { name: "Noodles", image: "https://static.vecteezy.com/system/resources/previews/036/083/981/non_2x/ai-generated-plate-of-ramen-isolated-on-transparent-background-free-png.png" },
    { name: "Momo", image: "https://png.pngtree.com/png-vector/20240429/ourmid/pngtree-delicious-momos-with-chutney-png-image_12341945.png" },
    { name: "Desserts", image: "https://static.vecteezy.com/system/resources/previews/049/408/306/non_2x/mixed-ice-cream-scoops-with-fruit-and-whipped-cream-in-clear-glass-bowl-transparent-file-png.png" },
    { name: "Pizza", image: "https://img.pikbest.com/png-images/20240505/spirited-mothers-day-holiday-wishes-222024-png-images-png_10550665.png!w700wp" },
    { name: "Pulao", image: "https://png.pngtree.com/png-clipart/20240905/original/pngtree-chicken-pulao-on-transparent-background-png-image_15934435.png" },
    { name: "Soup", image: "https://pngimg.com/d/soup_PNG71.png" },
    { name: "Kothu Paratta", image:"https://freedoorstep.in/fdsKartV3/public/uploads/all/RGsfiLjV5Q4IaoCdOD0T0Z5uLFG9uknzzrIjLsyX.png"},
    { name: "Sandwich",image:"https://static.vecteezy.com/system/resources/thumbnails/041/277/336/small_2x/ai-generated-sandwich-with-ham-cheese-tomatoes-and-lettuce-isolated-on-transparent-background-png.png"},
    { name: "Seafood",image:"https://file.aiquickdraw.com/imgcompressed/img/compressed_260edacf8ac0ad91328762ae0162e1c5.webp"},
    { name: "Tacos", image:"https://png.pngtree.com/png-clipart/20230422/ourmid/pngtree-mexican-taco-crepes-with-lemon-sauce-psd-transparent-png-image_6720528.png"},
    { name: "Meals", image:"https://png.pngtree.com/png-clipart/20220813/ourmid/pngtree-onam-simple-sadhya-served-in-banana-leaf-png-image_6109188.png"},
    { name: "Snacks", image:"https://static.vecteezy.com/system/resources/previews/013/167/413/non_2x/diwali-snacks-and-sweets-free-png.png"},
    { name: "Sizzler",image:"https://www.yankisizzlerr.com/wp-content/uploads/2021/10/Yanki-Special-Sizzler.png"},
    { name: "Curd Rice",image:"https://static.vecteezy.com/system/resources/thumbnails/027/144/362/small_2x/tasty-cooked-white-rice-isolated-on-transparent-background-png.png"},
    { name: "Kebabs",image:"https://static.vecteezy.com/system/resources/thumbnails/042/350/476/small_2x/ai-generated-3d-rendering-of-a-grilled-beef-kebab-on-transparent-background-ai-generated-png.png"},
    { name: "Broasted",image:"https://png.pngtree.com/png-vector/20231015/ourmid/pngtree-fried-chicken-and-french-fries-on-plate-png-image_10165794.png"},
    { name: "Chaat",image:"https://png.pngtree.com/png-vector/20240509/ourmid/pngtree-creamy-chaat-png-image_12431358.png"},
    { name: "Waffles",image:"https://png.pngtree.com/png-vector/20240506/ourmid/pngtree-berry-bonanza-waffles-with-fruit-syrup-and-luscious-blueberries-png-image_12286704.png"},
    { name: "Cafe",image:"https://static.vecteezy.com/system/resources/previews/028/882/781/non_2x/restaurant-food-food-transparent-restaurant-food-ai-generated-free-png.png"},
    { name: "Shakes",image:"https://img.pikbest.com/origin/10/07/18/91bpIkbEsTQnd.png!sw800"},
    { name: "Tea",image:"https://static.vecteezy.com/system/resources/thumbnails/017/340/372/small_2x/white-cup-of-tea-png.png"},
  ];

  const cuisines = [
    { name: "North Indian", image: "https://t4.ftcdn.net/jpg/06/01/16/63/360_F_601166394_1W98QexrsbQINOfjT6QVdFKF0e3TxzVk.jpg" },
    { name: "South Indian", image: "https://png.pngtree.com/thumb_back/fw800/background/20240619/pngtree-south-indian-thali-meal-with-dosa-idli-sambar-image_15877856.jpg" },
    { name: "Mexican", image: "https://i.pinimg.com/736x/83/33/8c/83338cdf1d69831d67aa932d1cdd8add.jpg" },
    { name: "Chinese", image: "https://i.pinimg.com/736x/60/e0/2b/60e02bb4ae76df54f3e9e0212689af07.jpg" },
    { name: "Italian", image: "https://img.freepik.com/free-photo/top-view-table-full-delicious-food-assortment_23-2149141339.jpg?semt=ais_hybrid" },
    { name: "Desserts", image: "https://i.pinimg.com/736x/79/af/bb/79afbbfd36cb5ef77b5662ea5cd78b32.jpg" },
    { name: "Snacks", image:"https://static.vecteezy.com/system/resources/thumbnails/046/069/942/small_2x/a-closeup-of-a-tray-filled-with-delectable-indian-snacks-such-as-samosas-kachoris-and-namak-pare-traditionally-prepared-and-shared-during-diwali-celebrations-photo.jpg"},
    { name: "Pan Asian",image:"https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/2020-01/pan-asian-food.jpg"},
    { name: "Tea",image:"https://img.freepik.com/premium-photo/cup-coffee-sits-table-plant_265515-6768.jpg"},
    
    
    
    
  ];

  const filteredItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  

  const handleInputChange = (e) => setSearchQuery(e.target.value);

  const handleCardClick = (name) => {
    navigate(`/restaurants/${name}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          } else {
            entry.target.style.opacity = 0;
            entry.target.style.transform = "translateY(100px)";
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        margin: "0 auto",
        padding: "-60px",
        minHeight: "100vh",
        overflow: "hidden",
        maxWidth: "380px",
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "20px",
          marginTop: "50px",
          marginBottom: "20px",
          boxShadow: "0 4px 8px rgba(0.5, 0.5, 0.5, 0.5)",
          position: "sticky",
          top: "0",
          zIndex: 1000,
        }}
      >
        <FaSearch style={{ fontSize: "20px", marginRight: "10px" }} />
        <input
          type="text"
          placeholder="Search by Cuisine..."
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "16px",
            flex: 1,
          }}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
      {/* Food Menu Section */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Left Arrow */}
        <button
          onClick={() => {
            scrollContainerRef.current.scrollBy({ left: -120, behavior: "smooth" });
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          {"<"}
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => {
            scrollContainerRef.current.scrollBy({ left: 120, behavior: "smooth" });
          }}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.5)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          {">"}
        </button>
        

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "10px",
            padding: "10px",
            scrollSnapType: "x mandatory",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item.name)}
              style={{
                display: "inline-block",
                minWidth: "120px",
                height: "140px",
                textAlign: "center",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                padding: "5px",
                cursor: "pointer",
                scrollSnapAlign: "start",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "0px",
                }}
              />
              <p style={{ fontSize: "14px", margin: 0 }}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {cuisines.map((cuisine, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(cuisine.name)}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              opacity: 0,
              transform: "translateY(100px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <img
              src={cuisine.image}
              alt={cuisine.name}
              style={{ width: "100%", height: "250px", objectFit: "cover" }}
            />
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h3
                style={{
                  color: "#333",
                  fontSize: "1.5em",
                  marginBottom: "10px",
                }}
              >
                {cuisine.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenuAndCuisine;
