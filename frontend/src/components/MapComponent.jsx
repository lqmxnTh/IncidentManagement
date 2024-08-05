import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';

const MapComponent = ({ latitude, longitude }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create a marker feature
    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    // Set the style for the marker
    marker.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',  // URL to marker image
      }),
    }));

    // Create a vector source and layer for the marker
    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Create the map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 12,
      }),
      controls: defaultControls(),
    });

    return () => map.setTarget(null);
  }, [latitude, longitude]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    ></div>
  );
};

export default MapComponent;
