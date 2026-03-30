# Token Tracker 💰

A sleek, minimalist web app to monitor your Anthropic API usage and Claude Pro subscription in real-time. Built with React + Vite.

## Features

✨ **Real-time API Integration**
- Connects to Anthropic API via Replit backend
- Shows live token usage, requests, and spending
- Auto-updates with refresh button

🎨 **Beautiful UI**
- Cream white theme (#f5f3f0) with black accents
- Smooth hover effects and transitions
- Fully responsive (mobile, tablet, desktop)
- Clean, minimalist design

🔒 **Privacy-First**
- API key stored locally in browser (localStorage)
- Never transmitted to third parties
- Clear data button to wipe everything

📊 **Usage Tracking**
- Input/output token counts
- Monthly spending tracker
- Request counter
- Progress bars for visual tracking
- Last updated timestamp

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or extract the project:**
   ```bash
   cd token-tracker-final
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` if needed (default backend is configured):
   ```
   VITE_API_URL=https://epavlou09.replit.app
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready to deploy.

## How to Use

1. **Get your API key:**
   - Go to [Anthropic Console](https://console.anthropic.com)
   - Navigate to API Keys
   - Copy your key (starts with `sk-ant-`)

2. **Enter and save:**
   - Paste the key in the input field
   - Click "Save Key"
   - Key is stored locally in your browser only

3. **Refresh data:**
   - Click "🔄 Refresh Data" button
   - Wait for data to load from the backend
   - See your usage stats update

4. **Monitor:**
   - Two cards show API and Pro subscription info
   - Progress bars visualize token usage
   - Timestamp shows when data was last fetched

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## API Integration

The app calls `POST https://epavlou09.replit.app/api/usage` with:

```json
{
  "apiKey": "sk-ant-..."
}
```

Expected response:
```json
{
  "requests": 1234,
  "input_tokens": 50000,
  "output_tokens": 30000,
  "spend": 1.25
}
```

## Browser Storage

- **API Key:** `localStorage.anthropic_api_key`
- **Data:** `localStorage.token_tracker_data`
- **Timestamp:** `localStorage.last_updated`

Clear anytime with the "🗑️ Clear Data" button.

## Styling Guide

CSS variables for easy theming:
```css
--bg-primary: #f5f3f0      /* Cream white */
--bg-secondary: #ffffff    /* Pure white */
--text-primary: #1a1a1a    /* Black */
--text-secondary: #666666  /* Gray */
--accent: #1a1a1a          /* Black accents */
```

## Technology Stack

- **Frontend:** React 18 + Vite
- **Styling:** CSS3 (no frameworks)
- **State:** React hooks (useState, useEffect)
- **Storage:** localStorage API
- **Backend:** Replit API integration

## Performance

- Vite production build: ~50KB (minified)
- React 18 with Strict Mode
- Optimized CSS with gradients and transitions
- Local storage for instant page loads

## Error Handling

- Invalid API key detection
- Network error fallbacks
- Graceful degradation with placeholder data
- User-friendly error messages

## License

MIT - Feel free to use and modify

## Support

For issues:
1. Check that your API key is valid
2. Ensure CORS is enabled on the backend
3. Check browser console for error details
4. Clear localStorage and try again

---

**Made with care** • Built with React + Vite • 🚀 Production-Ready
