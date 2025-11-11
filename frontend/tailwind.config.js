/** @type {import('tailwindcss').Config} */
module.exports = {
  // FIX: Updated content array to scan all relevant files in the src directory.
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Optional: You can customize your theme colors here
      colors: {
        'indigo-gopam': '#4f46e5', // Primary color for consistency
      },
    },
  },
  plugins: [],
}