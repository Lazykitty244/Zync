# 🎵 Zync

**Zync** is a real-time synchronized audio playback application that allows multiple devices to play audio in perfect harmony across a network. Built with **Next.js**, **TypeScript**, **Bun**, and **WebSockets**.

---

## ✨ Features

- **Real-time Audio Synchronization**: Play audio across multiple devices with millisecond precision  
- **Clock Synchronization**: Advanced ping-pong mechanism to sync device clocks  
- **Spatial Audio Visualization**: Interactive grid showing device positions  
- **File Upload Support**: Upload and share audio files instantly  
- **WebSocket Communication**: Real-time messaging between devices  
- **Session Management**: Create and join synchronized playback sessions
- **Device Management**: Track connected devices with nicknames and status
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
cd zync
```

#### Install dependencies
```bash
# Using npx (if npm isn't working properly)
npx bun install

# Or using bun directly (recommended)
bun install

# If npm is fixed
npm install
```

#### Start the development server
```bash
# Using bun (recommended)
bun run dev

# Using npx if bun command isn't available globally
npx bun run dev

# Or using npm (starts both Next.js and WebSocket server)
npm run dev
```

#### Open your browser
Navigate to: `http://localhost:3000`

For mobile devices, use your computer's IP: `http://[YOUR_IP]:3000`

---

## 📱 Multi-Device Setup

1. **Find your computer's IP address**
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

2. **Connect devices to the same network**
Ensure all devices are on the same WiFi network.

3. **Open the app on each device using your computer's IP**
Devices will automatically sync when they join the same session.

4. **Upload audio files and enjoy synchronized playback!**

---

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **Components**: Modular React components for audio controls, file upload, spatial visualization, and device management
- **Hooks**: Custom hooks for audio engine, clock synchronization, spatial audio, and WebSocket management
- **Types**: TypeScript definitions for type-safe development

### Backend (Bun + WebSockets)
- **Real-time Communication**: WebSocket server for instant messaging
- **File Handling**: Audio file upload and serving
- **Session Management**: Multi-device session coordination
- **Clock Synchronization**: Precise timing coordination between devices

---

## 🧠 Key Technologies

- **Bun**: Fast JavaScript runtime and package manager
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Web Audio API**: Precise audio playback and scheduling
- **WebSockets**: Real-time bidirectional communication
- **Clock Synchronization**: Custom ping-pong algorithm for time sync
- **Tailwind CSS**: Modern, responsive styling
- **Docker**: Containerized deployment

---

## 📁 Project Structure

```
zync/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # App layout
│   │   ├── globals.css        # Global styles
│   │   ├── api/
│   │   │   └── session/
│   │   │       └── [sessionId]/
│   │   │           └── route.ts
│   │   └── session/
│   │       └── [sessionId]/
│   │           └── page.tsx
│   ├── components/            # React components
│   │   ├── AudioControls.tsx     # Audio playback controls
│   │   ├── DeviceList.tsx        # Connected devices display
│   │   ├── FileUpload.tsx        # File upload interface
│   │   ├── MainApp.tsx           # Main application component
│   │   ├── NicknameSetup.tsx     # User nickname configuration
│   │   ├── ProgressSlider.tsx    # Audio progress control
│   │   └── SpatialGrid.tsx       # Device position visualization
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAudioEngine.ts     # Audio playback management
│   │   ├── useClockSync.ts       # Clock synchronization
│   │   └── useSpatialAudio.ts    # Spatial audio processing
│   └── types/                 # TypeScript type definitions
│       └── sync.ts            # Synchronization types
├── server/
│   └── index.ts               # WebSocket server with session management
├── shared/
│   └── types.ts               # Shared type definitions
├── uploads/                   # Audio file storage
├── public/                    # Static assets
├── .gitignore                 # Git ignore rules
├── bun.lockb                  # Bun lock file
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose setup
├── eslint.config.mjs          # ESLint configuration
├── next.config.js             # Next.js configuration
├── next-env.d.ts              # Next.js TypeScript declarations
├── package.json               # Project dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8081
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### Server Configuration
The WebSocket server runs on port 8081 by default. To change this, modify:

```typescript
// server/index.ts
const server = Bun.serve({
  port: 8081,
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
- Session-based device management

---

## 🛠️ Development

### Available Scripts

```bash
# Development
bun run dev          # Start both Next.js and WebSocket server
bun run server       # Start WebSocket server only

# Alternative using npx (if bun command isn't globally available)
npx bun run dev      # Start development servers
npx bun run server   # Start WebSocket server only

# Building
bun run build        # Build for production
bun run start        # Start production server
bun run start:prod   # Start both Next.js and WebSocket in production

# Linting & Type Checking
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript compiler

# Docker
bun run docker:build # Build Docker image
bun run docker:run   # Run Docker container
```

### Troubleshooting npm Issues

If you're experiencing npm issues but npx works:

1. **Clear npm cache**:
```bash
npm cache clean --force
```

2. **Use npx for package management**:
```bash
npx bun install    # Install dependencies
npx bun run dev    # Run development server
```

3. **Reinstall Node.js/npm** if the issue persists

4. **Use Bun directly** (recommended):
```bash
# Install Bun globally
curl -fsSL https://bun.sh/install | bash

# Then use Bun commands
bun install
bun run dev
```

### Adding New Features

- **Audio Effects**: Extend `useAudioEngine` hook
- **New Sync Messages**: Add to `src/types/sync.ts` and `shared/types.ts`
- **UI Components**: Add to `src/components/`
- **Server Features**: Modify `server/index.ts`
- **Spatial Audio**: Extend `useSpatialAudio` hook

---

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the image
docker build -t zync .

# Run the container
docker run -p 3000:3000 -p 8081:8081 zync
```

### Using Docker Compose
```bash
docker-compose up --build
```

---

## 🚀 Deployment

### Vercel (Frontend Only)
```bash
npm install -g vercel
vercel
```
*Note: You'll need to deploy the WebSocket server separately.*

### Full-Stack Deployment
- **Railway**: Full-stack deployment with WebSocket support
- **Render**: Node.js backend with static frontend
- **Docker**: Use the provided Dockerfile for any container platform

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


## 🙏 Acknowledgments

- Web Audio API
- Bun runtime
- Next.js
- Tailwind CSS

---

## 📞 Support

- Check the [Issues page](https://github.com/Lazykitty244/Zync/issues)
- Open a new issue with detailed information


---

*Made with ❤️ for synchronized audio experiences*
