# 🎵 Zync

**Zync** is a real-time synchronized audio playback application that allows multiple devices to play audio in perfect harmony across a network. Built with **Next.js**, **TypeScript**, and **WebSockets**.

---

## ✨ Features

- **Real-time Audio Synchronization**: Play audio across multiple devices with millisecond precision  
- **Clock Synchronization**: Advanced ping-pong mechanism to sync device clocks  
- **Spatial Audio Visualization**: Interactive grid showing device positions  
- **File Upload Support**: Upload and share audio files instantly  
- **WebSocket Communication**: Real-time messaging between devices  
- **Responsive Design**: Works seamlessly on desktop and mobile devices  

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/) runtime  
- Modern web browser with Web Audio API support  

### Installation

#### Clone the repository

```bash
git clone https://github.com/Lazykitty244/Zync.git
cd Zync
```

#### Install dependencies

```bash
# Using npm
npm install

# Or using bun
bun install
```

#### Start the development server

```bash
# Using npm
npm run dev

# Or using bun
bun run dev
```

#### Start the WebSocket server

```bash
# Using npm
npm run server

# Or using bun
bun run server
```

#### Open your browser

Navigate to: `http://localhost:3001`

For mobile devices, use your computer's IP:
`http://[YOUR_IP]:3001`

---

## 📱 Multi-Device Setup

### 1. Find your computer's IP address

```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

### 2. Connect devices to the same network

Ensure all devices are on the same WiFi network.

### 3. Open the app on each device using your computer's IP

Devices will automatically sync when they join.

### 4. Upload audio files and enjoy synchronized playback!

---

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)

- **Components**: Modular React components for audio controls, file upload, and spatial visualization
- **Hooks**: Custom hooks for audio engine, clock synchronization, and WebSocket management
- **Types**: TypeScript definitions for type-safe development

### Backend (Bun + WebSockets)

- **Real-time Communication**: WebSocket server for instant messaging
- **File Handling**: Audio file upload and serving
- **Session Management**: Multi-device session coordination

---

## 🧠 Key Technologies

- **Web Audio API**: Precise audio playback and scheduling
- **WebSockets**: Real-time bidirectional communication
- **Clock Synchronization**: Custom ping-pong algorithm for time sync
- **Tailwind CSS**: Modern, responsive styling

---

## 📁 Project Structure

```
beatsync/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # App layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── AudioControls.tsx     # Audio playback controls
│   │   ├── FileUpload.tsx        # File upload interface
│   │   └── SpatialGrid.tsx       # Device position visualization
│   ├── hooks/                # Custom React hooks
│   │   ├── useAudioEngine.ts     # Audio playback management
│   │   └── useClockSync.ts       # Clock synchronization
│   └── types/                # TypeScript type definitions
│       └── sync.ts           # Synchronization types
├── server/
│   └── index.ts              # WebSocket server
├── uploads/                  # Audio file storage
└── public/                   # Static assets
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Server Configuration

The WebSocket server runs on port 8080 by default. To change this, modify:

```typescript
// server/index.ts
const server = Bun.serve({
  port: 8080,
  // ... other config
});
```

---

## 🎯 Synchronization Accuracy

- **Local Network**: ~5–20ms
- **Good Internet**: ~20–50ms
- **Variable Networks**: ~50–200ms

The app uses:

- Clock offset calculation with ping-pong messaging
- Precise audio scheduling via Web Audio API
- Coordinated playback commands via WebSocket broadcasting

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev         # Start Next.js dev server
npm run server      # Start WebSocket server

# Building
npm run build       # Build for production
npm run start       # Start production server

# Linting
npm run lint        # Run ESLint
```

### Adding New Features

- **Audio Effects**: Extend `useAudioEngine` hook
- **New Sync Messages**: Add to `src/types/sync.ts`
- **UI Components**: Add to `src/components/`
- **Server Features**: Modify `server/index.ts`

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

- **Railway**: Full-stack deployment with WebSocket support
- **Render**: Node.js backend with static frontend
- **Heroku**: Traditional platform-as-a-service

---

## 🤝 Contributing

1. Fork the repository

2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. Push to GitHub:
   ```bash
   git push origin feature/amazing-feature
   ```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Bun runtime](https://bun.sh/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Support

- Check the [Issues](https://github.com/Lazykitty244/Zync/issues) page
- Open a new issue with detailed information
- Join community discussions

---

Made with ❤️ for synchronized audio experiences
