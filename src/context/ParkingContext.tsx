
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  available: boolean;
  pricePerHour: number;
  distance?: number;
  imageUrl?: string;
}

interface ParkingContextType {
  spots: ParkingSpot[];
  loading: boolean;
  selectedSpot: ParkingSpot | null;
  selectSpot: (spot: ParkingSpot) => void;
  clearSelectedSpot: () => void;
  bookSpot: (spotId: string, hours: number) => Promise<boolean>;
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number]) => void;
  nearbySpots: ParkingSpot[];
}

const ParkingContext = createContext<ParkingContextType>({
  spots: [],
  loading: true,
  selectedSpot: null,
  selectSpot: () => {},
  clearSelectedSpot: () => {},
  bookSpot: async () => false,
  userLocation: null,
  setUserLocation: () => {},
  nearbySpots: []
});

export const useParkingContext = () => useContext(ParkingContext);

// Mock data for parking spots
const MOCK_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    name: 'Downtown Parking',
    address: '123 Main St',
    latitude: 37.7749,
    longitude: -122.4194,
    available: true,
    pricePerHour: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  },
  {
    id: '2',
    name: 'Central Plaza',
    address: '456 Market St',
    latitude: 37.7735,
    longitude: -122.4173,
    available: true,
    pricePerHour: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: '3',
    name: 'Harbor Garage',
    address: '789 Embarcadero',
    latitude: 37.7900,
    longitude: -122.4100,
    available: false,
    pricePerHour: 6.75,
    imageUrl: 'https://images.unsplash.com/photo-1525530634744-5222b4a40f00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
  {
    id: '4',
    name: 'Tech Hub Parking',
    address: '101 Tech Blvd',
    latitude: 37.7831,
    longitude: -122.4040,
    available: true,
    pricePerHour: 7.25,
    imageUrl: 'https://images.unsplash.com/photo-1532264523420-881a47dbcfdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80'
  },
  {
    id: '5',
    name: 'Bay Area Lot',
    address: '202 Bay St',
    latitude: 37.7952,
    longitude: -122.4028,
    available: true,
    pricePerHour: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
  },
];

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // If the user has allowed location, center spots near them
        if (userLocation) {
          // Adjust mock data to be near the user's location
          const adjustedSpots = MOCK_SPOTS.map(spot => ({
            ...spot,
            latitude: userLocation[0] + (Math.random() - 0.5) * 0.01,
            longitude: userLocation[1] + (Math.random() - 0.5) * 0.01,
          }));
          setSpots(adjustedSpots);
        } else {
          // Use original mock data
          setSpots(MOCK_SPOTS);
        }
      } catch (error) {
        console.error('Failed to fetch parking spots', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load parking spots. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [userLocation, toast]);

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Get nearby spots when user location changes
  const nearbySpots = userLocation 
    ? spots.map(spot => ({
        ...spot,
        distance: calculateDistance(
          userLocation[0], 
          userLocation[1], 
          spot.latitude, 
          spot.longitude
        )
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0)) 
    : spots;

  const selectSpot = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };

  const clearSelectedSpot = () => {
    setSelectedSpot(null);
  };

  const bookSpot = async (spotId: string, hours: number): Promise<boolean> => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: `Your parking spot has been booked for ${hours} hour(s).`,
      });
      
      // Update spots to mark the booked spot as unavailable
      setSpots(prevSpots => 
        prevSpots.map(spot => 
          spot.id === spotId ? { ...spot, available: false } : spot
        )
      );
      
      if (selectedSpot?.id === spotId) {
        setSelectedSpot(prev => prev ? { ...prev, available: false } : null);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to book parking spot', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "We couldn't process your booking. Please try again.",
      });
      return false;
    }
  };

  return (
    <ParkingContext.Provider value={{
      spots,
      loading,
      selectedSpot,
      selectSpot,
      clearSelectedSpot,
      bookSpot,
      userLocation,
      setUserLocation,
      nearbySpots
    }}>
      {children}
    </ParkingContext.Provider>
  );
};
