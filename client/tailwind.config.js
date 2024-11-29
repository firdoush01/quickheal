// tailwind.config.js
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}", // Ensure that your content path is correct
];
export const theme = {
  extend: {
    keyframes: {
      "fade-in-up": {
        "0%": { opacity: 0, transform: "translateY(20px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
    },
    animation: {
      "fade-in-up": "fade-in-up 0.6s ease-out",
    },
  },
};
export const plugins = [];
