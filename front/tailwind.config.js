/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.tsx',
    './src/**/*.css',
    './index.html'
  ],
  // important: true,
  theme: { // defines color pallete, fonts, type scale, border sizes, breakpoints
    extend: {
      colors: {
        homeInput: '#111828',
        homeInputFocus: '#8CA4CB',
        appPurple: "#673AB7",
        modalBg: "rgba(0, 0, 0, 0.6)",
        projectBg: "#373737",
        registerBlue: "#83A2FF",
        customBlack: "rgba(31, 33, 36, 1)",
        taskSelected: "#576AEA",
        blacking: "#1F2124",
        taskFocus: "#303663"
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
      },
      outline: {
        'solid-transparent': ['2px solid transparent'],
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.input-custom-focus': {
          outline: '2px solid transparent',
          'outline-offset': '2px',
          'border-color': "#0ea5e9",
          'box-shadow': '0 0 0 2px rgba(14, 165, 233, 1)'
        },
        '.input-email-disabled': {
          'border-width': "0px",
          'color': 'inherit',
          'box-shadow': "0 0 #0000;"
        },
        '.input-email-invalid': {
          'color': "#ef4444",
          "padding-left": "0.25rem",
          "padding-right": "0.25rem",
          'font-size': "16px",
        }
      })
    }
  ],
}

// module.exports = {
//   theme: {
//     screens: {
//       'sm': '640px',
//       'md': '768px',
//       'lg': '1024px',
//       'xl': '1280px',
//       '2xl': '1536px',
//     }
//   }
// }

