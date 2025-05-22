
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Map from '@/components/Map';
import ParkingSpotList from '@/components/ParkingSpotList';
import { useParkingContext } from '@/context/ParkingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const { selectedSpot, clearSelectedSpot } = useParkingContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-parking-primary"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar toggle button - visible on mobile */}
            <button 
              className="fixed z-20 bottom-4 left-4 md:hidden bg-white p-2 rounded-full shadow-lg"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left-close"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
              )}
            </button>
            
            {/* Sidebar */}
            <div 
              className={`w-full md:w-96 bg-white shadow-lg transition-all duration-300 ease-in-out z-10 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
              } ${selectedSpot ? 'md:w-[30rem]' : 'md:w-96'}`}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h1 className="text-xl font-bold">Nearby Parking</h1>
                  <p className="text-sm text-gray-500">Find and book available spots</p>
                </div>
                
                {selectedSpot ? (
                  <div className="flex-1 overflow-y-auto p-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearSelectedSpot}
                      className="mb-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                      Back to list
                    </Button>
                    
                    <Card>
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img 
                          src={selectedSpot.imageUrl || '/placeholder.svg'} 
                          alt={selectedSpot.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{selectedSpot.name}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedSpot.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedSpot.available ? 'Available' : 'Full'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-500">Address</h4>
                            <p>{selectedSpot.address}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-gray-500">Price</h4>
                            <p className="text-xl font-bold">${selectedSpot.pricePerHour.toFixed(2)}<span className="text-sm font-normal text-gray-500">/hour</span></p>
                          </div>
                          
                          <div className="pt-4">
                            <Button 
                              className="w-full bg-parking-accent hover:bg-parking-accent/90"
                              disabled={!selectedSpot.available}
                            >
                              Book This Spot
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full mt-2 border-parking-primary text-parking-primary"
                            >
                              Get Directions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex-1">
                    <ParkingSpotList />
                  </div>
                )}
              </div>
            </div>
            
            {/* Map Area */}
            <div className="hidden md:block flex-1 p-4">
              <Map className="h-full" />
            </div>
            
            {/* Mobile map view (when sidebar is closed) */}
            <div className={`absolute inset-0 z-0 md:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
              <Map className="h-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
            <div className="max-w-3xl w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-parking-primary mb-4">Find Parking. Fast.</h1>
                <p className="text-xl text-gray-600">Locate and reserve parking spots near you in seconds.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-parking-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-parking-primary">
                        <circle cx="12" cy="12" r="10"/>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Find Nearby Spots</h3>
                    <p className="text-gray-500">Discover available parking spots near your destination in real-time.</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-parking-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-parking-primary">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <path d="M9 3v18"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Reserve & Pay</h3>
                    <p className="text-gray-500">Book your spot in advance and pay securely through the app.</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-parking-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-parking-primary">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Navigate Seamlessly</h3>
                    <p className="text-gray-500">Get turn-by-turn directions to your parking spot.</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center">
                <Button onClick={handleLogin} className="px-8 py-2 bg-parking-primary hover:bg-parking-primary/90">
                  Get Started
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  Already have an account? <a href="/login" className="text-parking-primary hover:underline">Login</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
