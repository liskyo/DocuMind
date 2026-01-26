/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'docu-dark': '#0a0a0f', // Deeper black for high contrast
                'docu-card': '#13131f', // Slightly lighter tint
                'docu-accent': '#00f0ff', // Cyberpunk Cyan
                'docu-neon-purple': '#bf00ff', // Neon Purple
                'risk-high': '#ff2a6d', // Neon Red
                'risk-warn': '#ffcc00', // Neon Yellow
                'risk-safe': '#05ffa1', // Neon Green
            },
            boxShadow: {
                'neon-blue': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
                'neon-red': '0 0 10px rgba(255, 42, 109, 0.5)',
            },
            fontFamily: {
                sans: ['Inter', 'Microsoft JhengHei', 'sans-serif'],
                mono: ['Fira Code', 'monospace']
            }
        },
    },
    plugins: [],
}
