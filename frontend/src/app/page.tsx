// client/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';

// Get the base URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HealthCheckResponse {
  message: string;
}

/**
 * Primary Homepage component for the Gopam application.
 * This component fetches a simple health check from the FastAPI backend to confirm connectivity.
 */
export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking API status...');

  useEffect(() => {
    // Check if the API URL is available
    if (!API_BASE_URL) {
      setApiStatus('Error: NEXT_PUBLIC_API_BASE_URL is not configured.');
      return;
    }

    /**
     * Function to call the FastAPI root endpoint (/)
     */
    async function checkApiHealth() {
      try {
        // [ICON: Network] Fetching API health check
        const response = await fetch(`${API_BASE_URL}/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: HealthCheckResponse = await response.json();
        setApiStatus(`API Status: SUCCESS [ICON: Check] - "${data.message}"`);
      } catch (error) {
        console.error("API Connection Error:", error);
        setApiStatus(`API Status: FAILED [ICON: Alert] - Is the server running at ${API_BASE_URL}?`);
      }
    }

    checkApiHealth();
  }, []); // Run only once on component mount

  return (
    <div>
      <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
        Welcome to Gopam: AI Recipe System
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Your smart assistant for meal planning and pantry management.
      </p>

      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">System Status Check</h3>
        <p className={`font-mono ${apiStatus.includes('SUCCESS') ? 'text-green-600' : 'text-red-600'}`}>
          {apiStatus}
        </p>
        <p className="mt-4 text-sm text-yellow-700">
          Ensure your server is running by navigating to `gopam/server/` and running: <code className="bg-yellow-100 p-1 rounded">uvicorn main:app --reload</code>
        </p>
      </div>

      <section className="mt-10 grid md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Pantry Inventory"
          iconText="[ICON: Storage]"
          description="Log and track every ingredient you have to minimize waste."
        />
        <FeatureCard 
          title="AI Recommendations"
          iconText="[ICON: AI]"
          description="Get recipes specifically tailored to your current inventory."
        />
        <FeatureCard 
          title="Recipe Library"
          iconText="[ICON: Book]"
          description="Store, search, and manage all your favorite cooking instructions."
        />
      </section>
    </div>
  );
}

// Simple Feature Card Component
function FeatureCard({ title, description, iconText }: { title: string, description: string, iconText: string }) {
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h4 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">{iconText} {title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}