/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
    './src/**/*.css',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        homeInput: '#111828',
        homeInputFocus: '#8CA4CB',
        appPurple: "#673AB7",
        modalBg: "rgba(0, 0, 0, 0.6)",
        projectBg: "#373737",
        registerBlue: "#83A2FF",
      },
      minHeight: {
        '1/2': '100px'
      },
      flex: {
        '3': '3 3 0%',
      },
      maxWidth: {
        "1200": "1200px"
      },
      width: {
        "65": "65px",
        "30per": "30%",
        "45per": "45%",
      },
      height: {
        "56": "56%"
      }
    },
  },
  plugins: [],
}

