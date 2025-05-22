
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParkingContext, ParkingSpot } from '@/context/ParkingContext';
import { formatDistance } from '@/lib/mapUtils';
import { useToast } from '@/components/ui/use-toast';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  selected?: boolean;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ spot, selected = false }) => {
  const { selectSpot, bookSpot } = useParkingContext();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingHours, setBookingHours] = useState(1);
  const { toast } = useToast();

  const handleViewDetails = () => {
    selectSpot(spot);
  };

  const handleBookNow = async () => {
    if (!spot.available) {
      toast({
        variant: "destructive",
        title: "Spot Unavailable",
        description: "This parking spot is currently not available for booking."
      });
      return;
    }

    setIsBooking(true);
    try {
      const success = await bookSpot(spot.id, bookingHours);
      if (success) {
        toast({
          title: "Booking Confirmed!",
          description: `You have successfully booked ${spot.name} for ${bookingHours} hour(s).`,
        });
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card className={`w-full transition-all ${selected ? 'ring-2 ring-parking-primary' : ''}`}>
      <div className="aspect-video w-full relative overflow-hidden rounded-t-lg">
        <img 
          src={spot.imageUrl || '/placeholder.svg'} 
          alt={spot.name} 
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${spot.available ? 'bg-parking-available' : 'bg-parking-unavailable'}`}>
          {spot.available ? 'Available' : 'Full'}
        </Badge>
        {spot.distance !== undefined && (
          <Badge variant="outline" className="absolute bottom-2 left-2 bg-white/80">
            {formatDistance(spot.distance)}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{spot.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-500">{spot.address}</p>
        <p className="font-semibold mt-1">${spot.pricePerHour.toFixed(2)}/hour</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-parking-primary text-parking-primary"
          onClick={handleViewDetails}
        >
          View
        </Button>
        <Button 
          size="sm"
          className="bg-parking-accent hover:bg-parking-accent/90 text-white"
          onClick={handleBookNow}
          disabled={!spot.available || isBooking}
        >
          {isBooking ? 'Booking...' : 'Book Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParkingSpotCard;
