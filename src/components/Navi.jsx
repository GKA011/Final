import React, { useEffect, useState, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { Feature } from "ol";
import { LineString, Point } from "ol/geom";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Stroke, Icon } from "ol/style";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { Container, Paper, useTheme, useMediaQuery, IconButton, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Autocomplete from '@mui/material/Autocomplete';
import graphData from '../data/graphData.json';

// Replace the inline graph definition with
const graph = graphData;


// A* Pathfinding Algorithm

const heuristic = (a, b) => {
  const [x1, y1] = a.split(",").map(Number);
  const [x2, y2] = b.split(",").map(Number);
  return Math.hypot(x2 - x1, y2 - y1);
};

const aStar = (graph, start, end) => {
  const openSet = [start];
  const closedSet = new Set();
  const cameFrom = {};
  const gScore = { [start]: 0 };
  const fScore = { [start]: heuristic(start, end) };

  const getLowestFScore = () =>
    openSet.reduce((lowest, node) =>
      fScore[node] < fScore[lowest] ? node : lowest
    );

  const reconstructPath = (current) => {
    const path = [current];
    while (current in cameFrom) {
      current = cameFrom[current];
      path.unshift(current);
    }
    return path;
  };

  while (openSet.length > 0) {
    const current = getLowestFScore();
    if (current === end) {
      return reconstructPath(current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.add(current);

    for (const neighbor in graph[current] || {}) {
      if (closedSet.has(neighbor)) continue;
      const tentativeGScore = gScore[current] + graph[current][neighbor];
      if (tentativeGScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return null;
};



// Define transition nodes (elevators/escalators) for each floor
const transitionNodes = {
  1: [{ x: 1179, y: 945, z: 1 }],
  2: [{ x: 2576, y: 1453, z: 1 }],
  3: [{ x: 3360, y: 1540, z: 1 }],
  4: [{ x: 1059, y: 758, z: 1 }],
  5: [{ x: 2605, y: 1625, z: 1 }],
  6: [{ x: 3406, y: 729, z: 1 }],
  7: [{ x: 1179, y: 945, z: 2 }],
  8: [{ x: 2576, y: 1453, z: 2 }],
  9: [{ x: 3360, y: 1540, z: 2 }],
  10: [{ x: 1059, y: 758, z: 2 }],
  11: [{ x: 2605, y: 1625, z: 2 }],
  12: [{ x: 3406, y: 729, z: 2 }],
  13: [{ x: 1179, y: 945, z: 3 }],
  14: [{ x: 2576, y: 1453, z: 3 }],
  15: [{ x: 3360, y: 1540, z: 3 }],
  16: [{ x: 1059, y: 758, z: 3 }],
  17: [{ x: 2605, y: 1625, z: 3 }],
  18: [{ x: 3406, y: 729, z: 3 }]
};

// Function to find nearest transition node
const findNearestTransitionNode = (point, floorNumber) => {
  const [x, y] = point.split(',').map(Number);
  
  // Get all transition nodes for the current floor
  const floorTransitions = Object.entries(transitionNodes)
    .filter(([key, value]) => value[0].z === floorNumber)
    .map(([key, value]) => value[0]);

  if (!floorTransitions || floorTransitions.length === 0) {
    console.error(`No transition nodes found for floor ${floorNumber}`);
    return null;
  }
  
  // Find the nearest transition node
  const nearest = floorTransitions.reduce((nearest, node) => {
    const distance = Math.hypot(node.x - x, node.y - y);
    if (!nearest || distance < nearest.distance) {
      return { node, distance };
    }
    return nearest;
  }, null);

  if (!nearest) {
    console.error(`Could not find nearest transition node for floor ${floorNumber}`);
    return null;
  }

  console.log(`Found nearest transition node at (${nearest.node.x}, ${nearest.node.y}) with distance ${nearest.distance}`);
  return nearest.node;
};

// Add this dictionary after the graph definition and before the A* algorithm
const shopCoordinates = {
  // Floor 1 Shops
  "Shoppers Stop":"963,1255,1",
"Westside":"820,839,1",
"Beauty n Nutrie":"1164,1339,1",
"My op":"1194,1145,1",
"Bieng human":"1172,1031,1",
"Under armor":"1258,727,1",
"costa coffee":"1250,524,1",
"tasva":"1316,1354,1",
"bose":"1317,1176,1",
"jaypore":"1456,1357,1",
"kushals":"1417,1179,1",
"imagine":"1451,718,1",
"hamleys":"1461,540,1",
"fab india":"1654,1367,1",
"tou by anu":"1487,1180,1",
"meena basar":"1590,1185,1",
"mamaearth":"1707,1190,1",
"enamor":"1780,1191,1",
"pepe jeans":"1571,714,1",
"vero moda":"1746,709,1",
"ritu kumar":"1876,1376,1",
"only":"1887,702,1",
"brikenstock":"1889,523,1",
"hush puppies":"2000,1380,1",
"peora":"2004,1201,1",
"kama":"2137,1199,1",
"soultree":"2114,1098,1",
"bath n body works":"2097,980,1",
"forest essentials":"2104,870,1",
"super dry":"2139,707,1",
"starbucks":"2087,510,1",
"lulu celebrate":"2312,1373,1",
"lobby":"2332,500,1",
"entrance":"2261,270,1",
"exit":"2474,272,1",
"mia":"2495,1192,1",
"lotus":"2629,1191,1",
"hi design":"2512,1107,1",
"nykaa":"2527,990,1",
"sunglass hut":"2525,873,1",
"the body shop":"2498,706,1",
"plum":"2629,713,1",
"tissot":"2531,522,1",
"rado":"2632,534,1",
"avntra":"2842,1376,1",
"jos alukas":"2741,1189,1",
"tommy hilfiger":"2743,720,1",
"longines":"2709,532,1",
"swift time house":"2787,532,1",
"swa":"2845,1182,1",
"clarus":"2916,1182,1",
"beverly hills polo":"2894,725,1",
"casio":"2906,563,1",
"josco":"3168,1356,1",
"kirali jewllers":"3006,1177,1",
"blue stone":"3081,1172,1",
"kalyan jewellers":"3304,1145,1",
"us pollo":"3066,733,1",
" ajmal":"3324,951,1",
"rare rabbit":"3178,737,1",
"alma carino":"3285,749,1",
"jack and jones":"3022,557,1",
"levis":"3162,561,1",
"american eagle":"3317,559,1",
"cold stone creamry":"3447,548,1",
"lulu hyper market":"3584,676,1",
"muffi house":"3455,1348,1",
"lulu forex":"3470,1477,1",
"aeka clinic":"3469,1640,1",
"arabian souk":"3468,1547,1",

  // Floor 2 Shops
 "Zudio":"1487,375,2",
"Max":"734,902,2",
"Pantaloons":"831,655,2",
"Alen Solly":"1006,1303,2",
"Basics":"1118,1321,2",
"Arkey by Ritu Kumar":"1268,1009,2",
"T the brand":"1267,730,2",
"Jokey":"1095,467,2",
"Go Colors":"1192,428,2",
"Zvame":"1288,404,2",
"Pettter England":"1280,1318,2",
"Manyavar":"1418,1330,2",
"Linen Club":"1397,1061,2",
"Vismay":"1350,850,2",
"Biba":"1409,654,2",
"Vanhusen":"1558,1336,2",
"Arrow":"1694,1337,2",
"Indian Terrain":"1555,1070,2",
"Kingdom of White":"1662,1075,2",
"My Designatio":"1726,1077,2",
"YoYoso":"1559,645,2",
"VH Inner Wear":"1697,639,2",
"Twin Birds":"1675,365,2",
"louis Philip":"1931,1354,2",
"Blackberry":"1833,1078,2",
"Colour Plus":"2001,1080,2",
" W N wishful":"1828,635,2",
"Timex":"1969,632,2",
"Aurelia":"1839,362,2",
"Soch":"1970,367,2",
"Mini Klub":"2518,1088,2",
"Samsonite":"2477,957,2",
"Levi's":"2484,817,2",
"US Polo kids":"2506,630,2",
"Woodland":"2492,383,2",
"Sere Perfumes":"2679,1353,2",
"United Colors of Benneton":"2773,1338,2",
"R and B":"2961,1324,2",
"Tony and Guy":"3157,1310,2",
"Lenskart":"3437,1315,2",
"VIP":"3322,1301,2",
"Burnt Umber Amukti":"2652,1080,2",
"Wildcraft":"2644,636,2",
"Safari":"2601,390,2",
"Baggit":"2674,390,2",
"American Tourister":"2749,1073,2",
"Fasttrack":"2816,1073,2",
"Spycar":"2769,645,2",
"Titan World":"2942,1072,2",
"Miniso":"3085,999,2",
"V star":"3003,864,2",
"Lens and Frames":"3076,738,2",
" Dock and Mark":"2947,654,2",
"Killer":"2805,395,2",
"Bata":"2915,400,2",
"Raymond":"3051,406,2",
"Metro":"3190,419,2",
"Mochi":"3301,428,2",
"Jewel hut":"3371,439,2",
"G lethers":"3454,424,2",
"LuLu Fashion Store":"3536,877,2",



  //Floor 3 Shops
  "Funtura":"699,987,3",
"Pizza Hut":"1061,1389,3",
"Burger King":"1164,1462,3",
"Wow china Wow momo":"1289,1548,3",
"Thalapakkati":"1370,1548,3",
"Taco bell":"1437,1547,3",
"Pizza Ricotta":"1509,1546,3",
"Dominos":"1576,1544,3",
"Matthan Leymon":"1646,1547,3",
"Vaigas ootupura":"1717,1548,3",
"Rice & Noodles":"1787,1542,3",
"Chiking":"1904,1548,3",
"North Express":"1987,1550,3",
"Nagas":"2055,1549,3",
"Halais":"2122,1550,3",
"Subway":"2191,1529,3",
"KFC":"2249,1423,3",
"Vasanta Bhavan ":"2683,1473,3",
"Paragon":"2973,1474,3",
"Macdonalds":"3463,1362,3",
"Baskin Robins":"1253,993,3",
"Fruit Bae":"1330,994,3",
"Belgian Waffle":"1569,1104,3",
"Chai Chai":"1642,1106,3",
"Cotton Candy":"1421,812,3",
"Vend N Go":"1753,924,3",
"Falooda Nation":"1815,926,3",
"Amul":"2551,1020,3",
"Wrap Vibes":"2623,988,3",
"Ice cream Chef":"2771,986,3",
"Frozen Bottle":"2487,720,3",
"Kulfi Shop":"2595,718,3",
"Kane and Corn":"2715,785,3",
"Selfie Tea":"2923,984,3",
"Klub House":"2804,715,3",
"Seetaphal":"2912,719,3",
"Pouch Gallery":"3319,1151,3",
"Asics":"967,467,3",
"Barbeque Nation":"1105,452,3",
"Lenovo":"1232,444,3",
"Acer Asus":"1333,433,3",
"Crossword":"1471,414,3",
"Petcare":"1595,404,3",
"Columbia":"1743,389,3",
"Adidas":"1879,374,3",
"Flame N Go":"2428,372,3",
"Crocs":"2565,387,3",
"HP":"2724,404,3",
"Puma":"2842,418,3",
"Sketchers":"2976,436,3",
"Strories":"3209,460,3",
"LuLu Connect":"3477,399,3",
"PVR":"3477,1332,3",
"Food Court":"1487,1474,3",
"Ovenly":"1202,603,3",
"Mouzy":"1343,534,3",
"MyFroyoland":"1493,582,3",
"House of Candy":"1619,555,3",
"Buiseness Longue":"2527,1523,3",
};

const MapComponent = () => {
  const mapRef = useRef(null);
  const [activeMap, setActiveMap] = useState(1);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [destinationFloor, setDestinationFloor] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [pathToDestination, setPathToDestination] = useState(null);
  const [transitionNodeEnd, setTransitionNodeEnd] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shopNames = Object.keys(shopCoordinates);

  // Add this function to get coordinates from shop name
  const getCoordinatesFromShopName = (shopName) => {
    const coordinates = shopCoordinates[shopName];
    if (!coordinates) {
      throw new Error(`Shop "${shopName}" not found in the directory`);
    }
    return coordinates;
  };

  // Add this function to get floor number from coordinates
  const getFloorFromCoordinates = (coordinates) => {
    const [x, y, z] = coordinates.split(",").map(Number);
    return z;
  };

  // Update destination floor when endNode changes
  useEffect(() => {
    if (endNode) {
      try {
        const coordinates = getCoordinatesFromShopName(endNode);
        const floor = getFloorFromCoordinates(coordinates);
        setDestinationFloor(floor);
      } catch (error) {
        setDestinationFloor(null);
      }
    } else {
      setDestinationFloor(null);
    }
  }, [endNode]);

  const mapConfigs = [
    {
      extent: [0, 0, 4910, 1953],
      center: [2400, 925],
      zoom: 1,
      svgUrl: "/Ground (1).svg",
      mapNumber: 1
    },
    {
      extent: [0, 0, 4910, 1953],
      center: [2400, 925],
      zoom: 1,
      svgUrl: "/First (1).svg",
      mapNumber: 2
    },
    {
      extent: [0, 0, 4910, 1953],
      center: [2400, 925],
      zoom: 1,
      svgUrl: "/Second (1).svg",
      mapNumber: 3
    }
  ];

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const config = mapConfigs.find(c => c.mapNumber === activeMap);
    if (!config) return;

    const vectorSource = new VectorSource();
    const vectorLayerInstance = new VectorLayer({
      source: vectorSource,
    });

    const mapInstance = new Map({
      target: "map",
      layers: [
        new ImageLayer({
          source: new Static({
            url: config.svgUrl,
            imageExtent: config.extent,
          }),
        }),
        vectorLayerInstance,
      ],
      view: new View({
        center: config.center,
        zoom: config.zoom,
        extent: config.extent,
      }),
    });

    mapRef.current = mapInstance;
    setVectorLayer(vectorLayerInstance);
  }, [activeMap]);

  // Handle map changes
  const handleMapChange = (mapNumber) => {
    const config = mapConfigs.find(c => c.mapNumber === mapNumber);
    if (!config) return;
    
    if (mapRef.current) {
      // Update the image layer
      const layers = mapRef.current.getLayers();
      const imageLayer = new ImageLayer({
        source: new Static({
          url: config.svgUrl,
          imageExtent: config.extent,
        }),
      });
      
      // Remove old layers and add new ones
      layers.clear();
      layers.push(imageLayer);
      
      // Create new vector layer for the paths
      const newVectorSource = new VectorSource();
      const newVectorLayer = new VectorLayer({ source: newVectorSource });
      layers.push(newVectorLayer);
      setVectorLayer(newVectorLayer);
    }
    
    setActiveMap(mapNumber);
  };

  //component for man-icon
  const animateManIcon = (pathCoords, vectorSource) => {
    let currentIndex = 0;

    // Feature for the man icon
    const manFeature = new Feature({
      geometry: new Point(pathCoords[currentIndex]),
    });

    manFeature.setStyle(
      new Style({
        image: new Icon({
          src: "https://static.thenounproject.com/png/429544-200.png", // Path to your man icon image
          scale: 0.05, // Scale the icon to fit the map
          anchor: [0.5, 0.5], // Center the icon
        }),
      })
    );

    vectorSource.addFeature(manFeature);

    const animate = () => {
      if (currentIndex >= pathCoords.length - 1) {
        return; // Animation ends
      }

      currentIndex++;
      manFeature.getGeometry().setCoordinates(pathCoords[currentIndex]);

      requestAnimationFrame(animate);
    };

    animate();
  };

  //display animated path
  const animateTrailGradientAndDashed = (coordinates) => {
    const trailSource = new VectorSource();
    const trailLayer = new VectorLayer({
      source: trailSource,
      style: (feature) => {
        const progress = feature.get("progress") || 0;
        const startColor = [63, 94, 251];
        const endColor = [252, 70, 107];
        const interpolatedColor = startColor.map((start, i) =>
          Math.round(start + progress * (endColor[i] - start))
        );
  
        return new Style({
          stroke: new Stroke({
            color: `rgba(${interpolatedColor.join(",")}, 1)`,
            width: 5,
            lineDash: [3, 4], // Dashed line
            lineDashOffset: feature.get("dashOffset") || 0, // Moving dash offset
            lineCap: "round",
            lineJoin: "round",
          }),
        });
      },
    });
    mapRef.current.addLayer(trailLayer);
  
    const stepInterval = 50;
    const totalSteps = 100;
    let currentStep = 0;
    let dashOffset = 0; // Initial dash offset
  
    const animateStep = () => {
      if (currentStep > totalSteps) return;
  
      const progress = currentStep / totalSteps;
      trailSource.clear();
      const partialCoordinates = coordinates.slice(
        0,
        Math.ceil(progress * coordinates.length)
      );
      const trailFeature = new Feature(new LineString(partialCoordinates));
      trailFeature.set("progress", progress);
      trailFeature.set("dashOffset", dashOffset); // Update dash offset
      
      trailSource.addFeature(trailFeature);
      
      dashOffset -= 0.5; // Smoother dash animation (reduced value)
      currentStep++;
      
      if (currentStep <= totalSteps) {
        setTimeout(animateStep, stepInterval);
      }
    };
  
    animateStep();
  };

  //calculate and display path
  const calculatePath = async () => {
    if (!startNode || !endNode) {
      setSnackbarMessage("Please enter both start and end points");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Get coordinates from shop names
      const startCoordinates = getCoordinatesFromShopName(startNode);
      const endCoordinates = getCoordinatesFromShopName(endNode);

      //obtain x,y,z coordinates of start and end node
      const [startX, startY, startZ] = startCoordinates.split(",").map(Number);
      const [endX, endY, endZ] = endCoordinates.split(",").map(Number);

      if (startZ === endZ) {
        setIsLoading(true);
        const path = aStar(graph, startCoordinates, endCoordinates);
        setIsLoading(false);

        if (!path) {
          alert("No path found!");
          return;
        }

        const coordinates = path.map((node) => {
          const [x, y, z] = node.split(",").map(Number);
          // Apply correction for path shifting
          const correctedX = x + (y > 800 ? 3 : 0);
          return [correctedX, y, z];
        });
        handleMapChange(startZ);
        vectorLayer.getSource().clear();
        animateTrailGradientAndDashed(coordinates.filter(([x, y, z]) => z === startZ));
      } else {
        // Multi-floor navigation logic
        const startFloorTransition = findNearestTransitionNode(startCoordinates, startZ);
        console.log('Start floor transition node:', startFloorTransition);
        
        const transitionNodeStart = `${startFloorTransition.x},${startFloorTransition.y},${startZ}`;
        console.log('Transition node start:', transitionNodeStart);
        
        const pathToTransition = aStar(graph, startCoordinates, transitionNodeStart);
        console.log('Path to transition:', pathToTransition);

        if (!pathToTransition) {
          alert("No path to transition node found!");
          return;
        }

        // First floor animation
        handleMapChange(startZ);
        vectorLayer.getSource().clear();
        const firstFloorCoords = pathToTransition.map((node) => {
          const [x, y, z] = node.split(",").map(Number);
          const correctedX = x + (y > 800 ? 3 : 0);
          return [correctedX, y, z];
        });
        animateTrailGradientAndDashed(firstFloorCoords);

        // Store the transition node and path to destination for later use
        const transitionNodeEnd = `${startFloorTransition.x},${startFloorTransition.y},${endZ}`;
        const pathFromTransition = aStar(graph, transitionNodeEnd, endCoordinates);
        
        if (!pathFromTransition) {
          alert("No path from transition node to destination found!");
          return;
        }

        setTransitionNodeEnd(transitionNodeEnd);
        setPathToDestination(pathFromTransition);
        setShowNextButton(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle next button click for multi-floor navigation
  const handleNextClick = () => {
    if (pathToDestination && transitionNodeEnd) {
      handleMapChange(destinationFloor);
      vectorLayer.getSource().clear();
      const secondFloorCoords = pathToDestination.map((node) => {
        const [x, y, z] = node.split(",").map(Number);
        const correctedX = x + (y > 800 ? 3 : 0);
        return [correctedX, y, z];
      });
      animateTrailGradientAndDashed(secondFloorCoords);
      setShowNextButton(false);
      setPathToDestination(null);
      setTransitionNodeEnd(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, my: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: '#1a237e',
              fontWeight: 'bold',
            }}
          >
            INDOOR NAVIGATION SYSTEM
          </Typography>
          <Tooltip title="Help">
            <IconButton onClick={() => setShowHelp(!showHelp)} color="primary">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {showHelp && (
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="body1" gutterBottom>
              How to use:
            </Typography>
            <Typography variant="body2" component="div" sx={{ pl: 2 }}>
              <ol>
                <li>Enter the starting shop name in the first field</li>
                <li>Enter the destination shop name in the second field</li>
                <li>Click "Calculate Path" to see the route</li>
                <li>Use the floor selector to manually switch between floors</li>
                <li>The path will automatically show transitions between floors if needed</li>
              </ol>
            </Typography>
          </Paper>
        )}

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            mb: 3,
            alignItems: isMobile ? 'stretch' : 'center'
          }}
        >
          <Autocomplete
            fullWidth
            options={shopNames}
            value={startNode}
            onChange={(event, newValue) => setStartNode(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Start Shop"
            placeholder="Enter shop name"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ padding: '8px 16px' }}>
                {option}
              </li>
            )}
            freeSolo
            sx={{ flex: 1 }}
          />
          <Autocomplete
            fullWidth
            options={shopNames}
            value={endNode}
            onChange={(event, newValue) => setEndNode(newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="End Shop"
            placeholder="Enter shop name"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ padding: '8px 16px' }}>
                {option}
              </li>
            )}
            freeSolo
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={calculatePath}
            disabled={isLoading}
            startIcon={<SearchIcon />}
            sx={{
              minWidth: isMobile ? '100%' : 'auto',
              height: '40px',
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate Path"
            )}
          </Button>
        </Box>

        {destinationFloor && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              p: 1,
              bgcolor: '#e3f2fd',
              borderRadius: 1
            }}
          >
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#1a237e',
                fontWeight: 'medium',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LocationOnIcon color="primary" />
              Destination is on Floor {destinationFloor}
            </Typography>
          </Box>
        )}

        {showNextButton && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2
            }}
          >
            <Button
              variant="contained"
              onClick={handleNextClick}
              startIcon={<LocationOnIcon />}
              sx={{
                background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
                },
              }}
            >
              Continue to Floor {destinationFloor}
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowFloorSelector(!showFloorSelector)}
            sx={{ mb: 2 }}
          >
            {showFloorSelector ? 'Hide Floor Selector' : 'Show Floor Selector'}
          </Button>
        </Box>

        {showFloorSelector && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {[1, 2, 3].map((floor) => (
              <Button
                key={floor}
                variant={currentFloor === floor ? "contained" : "outlined"}
                onClick={() => {
                  handleMapChange(floor);
                  setCurrentFloor(floor);
                }}
              >
                Floor {floor}
              </Button>
            ))}
          </Box>
        )}

        <Paper 
          elevation={2} 
          sx={{ 
            width: '100%', 
            height: isMobile ? '400px' : '500px',
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        </Paper>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="info">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default MapComponent;
