
import mapboxgl from 'mapbox-gl';
import { ParkingSpot } from '@/context/ParkingContext';

// Initialize with a temporary token - in real app, use environment variables
// This would be replaced with your actual Mapbox token
let mapboxToken = '';

export const initializeMapboxToken = (token: string) => {
  mapboxToken = token;
  mapboxgl.accessToken = token;
};

export const createMap = (
  container: HTMLDivElement,
  center: [number, number] = [-122.4194, 37.7749], // Default to San Francisco
  zoom = 13
): mapboxgl.Map => {
  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom,
  });
};

export const addUserLocationMarker = (
  map: mapboxgl.Map, 
  userLocation: [number, number]
): mapboxgl.Marker => {
  // Create a DOM element for the custom marker
  const el = document.createElement('div');
  el.className = 'w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg relative';
  
  // Create a pulse effect
  const pulse = document.createElement('div');
  pulse.className = 'absolute -inset-2 bg-blue-500 opacity-30 rounded-full animate-ping';
  el.appendChild(pulse);

  // Add marker to map
  return new mapboxgl.Marker(el)
    .setLngLat([userLocation[1], userLocation[0]])
    .addTo(map);
};

export const addParkingSpotMarkers = (
  map: mapboxgl.Map, 
  spots: ParkingSpot[],
  onMarkerClick: (spot: ParkingSpot) => void
): mapboxgl.Marker[] => {
  return spots.map(spot => {
    // Create a DOM element for the marker
    const el = document.createElement('div');
    el.className = `marker-pin ${spot.available ? 'marker-available' : 'marker-unavailable'}`;
    el.textContent = 'P';
    
    // Create the marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([spot.longitude, spot.latitude])
      .addTo(map);
    
    // Add click event
    marker.getElement().addEventListener('click', () => {
      onMarkerClick(spot);
    });
    
    return marker;
  });
};

export const flyToLocation = (
  map: mapboxgl.Map, 
  location: [number, number],
  zoom = 15
): void => {
  map.flyTo({
    center: [location[1], location[0]],
    zoom,
    essential: true
  });
};

export const addPopup = (
  map: mapboxgl.Map,
  coordinates: [number, number],
  content: HTMLElement
): mapboxgl.Popup => {
  return new mapboxgl.Popup({ offset: 25 })
    .setLngLat([coordinates[1], coordinates[0]])
    .setDOMContent(content)
    .addTo(map);
};

export const getDirections = (
  start: [number, number],
  end: [number, number]
): Promise<any> => {
  // In a real app, you would call the Mapbox Directions API here
  // For simplicity, we just return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        routes: [
          {
            distance: 2.5, // kilometers
            duration: 420, // seconds
            geometry: {
              coordinates: [
                [start[1], start[0]],
                [end[1], end[0]]
              ]
            }
          }
        ]
      });
    }, 500);
  });
};

export const drawRoute = (
  map: mapboxgl.Map,
  coordinates: [number, number][]
): void => {
  // Check if the route layer already exists
  if (map.getLayer('route')) {
    map.removeLayer('route');
  }
  
  // Check if the route source already exists
  if (map.getSource('route')) {
    map.removeSource('route');
  }
  
  map.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': coordinates
      }
    }
  });
  
  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#3b82f6',
      'line-width': 5
    }
  });
};

export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true
      });
    }
  });
};

export const formatDistance = (distance?: number): string => {
  if (distance === undefined) return 'Unknown';
  
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};
