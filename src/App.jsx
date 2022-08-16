import { useRef, useEffect, useState } from "react";
import "./App.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";

// Import axios
import axios from "axios";

function App() {
  const mapElement = useRef();
  const [mapZoom, setMapZoom] = useState(15);
  const [map, setMap] = useState({});

  useEffect(() => {
    let map = ttmaps.map({
      key: "pr8zIB21ZpFeJnXiIRzxcPGeo7kpoJDu",
      container: "map-area",
      center: [3.34889, 6.537216],
      zoom: mapZoom,
    });
    setMap(map);
    return () => {
      map.remove();
    };
  }, []);

  // Create snapfunction to get all the data from the API
  const getSnapFunction = () => {
    axios
      .get(
        "https://api.tomtom.com/snap-to-roads/1/snap-to-roads?points=4.6104,52.3757;4.6140,52.393&fields={projectedPoints{type,geometry{type,coordinates},properties{routeIndex}},route{type,geometry{type,coordinates},properties{id,speedRestrictions{maximumSpeed{value,unit}}}}}&key=pr8zIB21ZpFeJnXiIRzxcPGeo7kpoJDu"
      )
      .then((res) => {
        console.log(res.data);
        res.data.route.forEach((item) => {
          map.addLayer({
            id: Math.random().toString(),
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "LineString",
                      properties: {},
                      coordinates: item.geometry.coordinates,
                    },
                  },
                ],
              },
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#ff0000",
              "line-width": 3,
            },
          });
        });
        map.setCenter([parseFloat(4.6104), parseFloat(52.3757)]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          getSnapFunction();
        }}
      >
        Snap to Road API
      </button>
      <div ref={mapElement} id="map-area"></div>
    </div>
  );
}

export default App;
