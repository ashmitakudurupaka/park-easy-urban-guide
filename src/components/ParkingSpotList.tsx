
import React from 'react';
import { useParkingContext } from '@/context/ParkingContext';
import ParkingSpotCard from './ParkingSpotCard';
import { ScrollArea } from '@/components/ui/scroll-area';

const ParkingSpotList = () => {
  const { nearbySpots, selectedSpot, loading } = useParkingContext();

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-full border-4 border-parking-primary border-t-transparent animate-spin"></div>
        <p className="mt-4 text-parking-primary font-semibold">Loading parking spots...</p>
      </div>
    );
  }

  if (nearbySpots.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-parking-square"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></svg>
        </div>
        <p className="mt-4 text-gray-500 font-semibold">No parking spots found</p>
        <p className="mt-2 text-sm text-gray-400 text-center">Try adjusting your location or searching in another area.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 grid grid-cols-1 gap-4">
        {nearbySpots.map((spot) => (
          <ParkingSpotCard 
            key={spot.id} 
            spot={spot} 
            selected={selectedSpot?.id === spot.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ParkingSpotList;
