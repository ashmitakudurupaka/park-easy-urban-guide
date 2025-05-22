
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParkingContext } from '@/context/ParkingContext';
import {
  createMap,
  addUserLocationMarker,
  addParkingSpotMarkers,
  flyToLocation,
  getUserLocation,
  drawRoute,
  getDirections,
  initializeMapboxToken
} from '@/lib/mapUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

interface MapProps {
  className?: string;
}

const Map: React.FC<MapProps> = ({ className = '' }) => {
  const { 
    spots, 
    selectSpot, 
    selectedSpot, 
    userLocation, 
    setUserLocation 
  } = useParkingContext();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const parkingMarkers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxKey, setMapboxKey] = useState('');
  const [keyEntered, setKeyEntered] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();
  
  // Initialize map when component mounts and token is set
  useEffect(() => {
    if (!mapboxKey || !keyEntered || !mapContainer.current) return;
    
    try {
      initializeMapboxToken(mapboxKey);
      
      if (!mapRef.current) {
        mapRef.current = createMap(
          mapContainer.current,
          userLocation ? [userLocation[0], userLocation[1]] : undefined
        );
        
        mapRef.current.on('load', () => {
          // Check if user has given permission for geolocation
          getUserLocation()
            .then(position => {
              const { latitude, longitude } = position.coords;
              setUserLocation([latitude, longitude]);
              
              // Fly to user location
              if (mapRef.current) {
                flyToLocation(mapRef.current, [latitude, longitude]);
                
                // Add user marker
                userMarker.current = addUserLocationMarker(
                  mapRef.current, 
                  [latitude, longitude]
                );
              }
            })
            .catch(error => {
              console.error("Error getting location:", error);
              toast({
                variant: "destructive",
                title: "Location Access Denied",
                description: "We can't show nearby parking spots without location access."
              });
            });
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        variant: "destructive",
        title: "Map Error",
        description: "Failed to initialize the map. Please check your API key or try again later."
      });
    }
    
    return () => {
      // Clean up
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapboxKey, keyEntered, userLocation, setUserLocation, toast]);
  
  // Update markers when spots change
  useEffect(() => {
    if (!mapRef.current || !keyEntered || spots.length === 0) return;
    
    // Clear existing markers
    parkingMarkers.current.forEach(marker => marker.remove());
    parkingMarkers.current = [];
    
    // Add new markers
    parkingMarkers.current = addParkingSpotMarkers(
      mapRef.current,
      spots,
      spot => {
        selectSpot(spot);
        if (mapRef.current) {
          flyToLocation(mapRef.current, [spot.latitude, spot.longitude]);
        }
      }
    );
  }, [spots, selectSpot, keyEntered]);
  
  // Handle navigation when a spot is selected
  useEffect(() => {
    if (!mapRef.current || !userLocation || !selectedSpot || !isNavigating) return;
    
    const startNav = async () => {
      try {
        const directions = await getDirections(
          userLocation,
          [selectedSpot.latitude, selectedSpot.longitude]
        );
        
        if (directions.routes && directions.routes.length > 0) {
          const route = directions.routes[0];
          drawRoute(mapRef.current!, route.geometry.coordinates);
          
          toast({
            title: "Navigation Started",
            description: `Distance: ${(route.distance).toFixed(1)} km, Duration: ${Math.floor(route.duration / 60)} minutes`
          });
        }
      } catch (error) {
        console.error("Error getting directions:", error);
        toast({
          variant: "destructive",
          title: "Navigation Failed",
          description: "Could not retrieve directions to the parking spot."
        });
      }
    };
    
    startNav();
  }, [selectedSpot, userLocation, isNavigating, toast]);
  
  const handleNavigate = () => {
    if (!userLocation) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Enable location services to use navigation."
      });
      return;
    }
    
    if (!selectedSpot) {
      toast({
        title: "Select a Spot",
        description: "Please select a parking spot to navigate to."
      });
      return;
    }
    
    setIsNavigating(true);
  };
  
  const handleKeySet = () => {
    if (!mapboxKey.trim()) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter your Mapbox API key."
      });
      return;
    }
    
    setKeyEntered(true);
    toast({
      title: "API Key Set",
      description: "Your Mapbox API key has been applied."
    });
  };

  return (
    <div className={`relative ${className}`}>
      {!keyEntered ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Enter your Mapbox API Key</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md text-center">
            To use the map features, you need to provide a Mapbox API key. 
            Get one for free at <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer" className="text-parking-primary underline">mapbox.com</a>
          </p>
          <div className="w-full max-w-md flex space-x-2">
            <Input 
              type="text" 
              placeholder="Enter Mapbox API key" 
              value={mapboxKey} 
              onChange={(e) => setMapboxKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleKeySet}>Set Key</Button>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg" />
          
          {selectedSpot && userLocation && (
            <div className="absolute bottom-4 left-0 right-0 mx-4">
              <div className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{selectedSpot.name}</h3>
                  <p className="text-sm text-gray-500">{selectedSpot.address}</p>
                </div>
                <Button 
                  onClick={handleNavigate}
                  disabled={isNavigating}
                  className="bg-parking-primary hover:bg-parking-primary/90"
                >
                  {isNavigating ? 'Navigating...' : 'Navigate'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Map;
