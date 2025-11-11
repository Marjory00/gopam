// frontend/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Globe, Check, AlertTriangle, Package, Bot, BookOpen } from 'lucide-react';

// Get the base URL from the environment variables
// Note: In a real environment, this might be dynamically configured or handled by the deployment tool.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface HealthCheckResponse {
  message: string;
}

/**
 * Primary Homepage component for the Gopam application.
 * This component fetches a simple health check from the FastAPI backend to confirm connectivity.
 */
export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking API status...');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    /**
     * Function to call the FastAPI root endpoint (/)
     */
    async function checkApiHealth() {
      if (!API_BASE_URL || API_BASE_URL.includes('undefined')) {
        setApiStatus('Error: NEXT_PUBLIC_API_BASE_URL is not configured correctly.');
        setIsSuccess(false);
        return;
      }

      try {
        setApiStatus('Attempting connection...');
        const response = await fetch(`${API_BASE_URL}/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: HealthCheckResponse = await response.json();
        setApiStatus(`API Status: SUCCESS - "${data.message}"`);
        setIsSuccess(true);
      } catch (error) {
        console.error("API Connection Error:", error);
        setApiStatus(`API Status: FAILED - Is the server running at ${API_BASE_URL}?`);
        setIsSuccess(false);
      }
    }

    checkApiHealth();
  }, []); // Run only once on component mount

  // Helper to determine status icon
  const StatusIcon = isSuccess === true 
    ? Check 
    : isSuccess === false 
    ? AlertTriangle 
    : Globe;
  
  // Helper to determine status color
  const statusColor = isSuccess === true 
    ? 'text-green-600 border-green-300 bg-green-50' 
    : isSuccess === false 
    ? 'text-red-600 border-red-300 bg-red-50'
    : 'text-yellow-600 border-yellow-300 bg-yellow-50';

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Welcome - Gopam AI Recipe System</title>
      </Head>
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
            Gopam: AI Recipe System
          </h1>
          <p className="text-xl text-gray-600">
            Your smart assistant for meal planning and pantry management.
          </p>
        </div>

        {/* --- System Status Check Card --- */}
        <div className={`p-6 border-2 rounded-xl shadow-lg transition-colors duration-300 mb-12 ${statusColor}`}>
          <h3 className="text-xl font-bold flex items-center mb-3">
            <StatusIcon className={`w-6 h-6 mr-3 ${isSuccess === true ? 'text-green-600' : 'text-red-600'}`} />
            Backend API Health Check
          </h3>
          <p className="font-mono text-sm break-words">
            {apiStatus}
          </p>
          <p className="mt-4 text-sm font-medium text-gray-700">
            To run the FastAPI server, navigate to your server directory (e.g., `tramar/server/`) and execute: <code className="bg-gray-100 p-1 rounded font-mono text-xs">uvicorn main:app --reload</code>
          </p>
        </div>

        {/* --- Feature Cards Section --- */}
        <section className="mt-10">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Pantry Inventory"
              Icon={Package}
              description="Log and track every ingredient you have, complete with expiration dates, to minimize food waste."
              color="text-green-600"
            />
            <FeatureCard 
              title="AI Recommendations"
              Icon={Bot}
              description="Get recipes specifically tailored to maximize the use of ingredients currently in your pantry."
              color="text-indigo-600"
            />
            <FeatureCard 
              title="Recipe Library"
              Icon={BookOpen}
              description="Store, search, and manage all your favorite cooking instructions and generated AI recipes."
              color="text-orange-600"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// Simple Feature Card Component
function FeatureCard({ title, description, Icon, color }: { title: string, description: string, Icon: React.ElementType, color: string }) {
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <Icon className={`w-8 h-8 mb-3 ${color}`} />
      <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}