module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue, js, ts, jsx, tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'moe': ['LXGW XiHei', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: ['autumn', 'light', 'night'],
    darkTheme: 'night'
  }
}
