
import React from 'react';
import Authentication from '@/components/Authentication';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();

  // If already logged in, redirect to home page
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Image/Branding */}
        <div className="w-full md:w-1/2 bg-parking-primary p-8 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-6">ParkSpot</h1>
            <p className="text-lg mb-4">Find, reserve, and pay for parking spots with ease.</p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time availability
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                In-app navigation
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Seamless digital payments
              </li>
            </ul>
          </div>
          <div className="mt-6">
            <p className="text-sm opacity-80">© 2023 ParkSpot. All rights reserved.</p>
          </div>
        </div>

        {/* Right side - Authentication form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
          <Authentication />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
