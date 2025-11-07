# Hadith 360

**Every Hadith. Every Language. Every Reference.**

A comprehensive web application for accessing authenticated Hadith literature with accurate translations and references. Search through major Islamic collections including Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawood, Jami' at-Tirmidhi, Sunan Ibn Majah, and Sunan an-Nasa'i.

## Features

- **Comprehensive Collections**: Access to 34,000+ hadiths from 6 major collections
  - Sahih al-Bukhari (7,563 hadiths)
  - Sahih Muslim (7,190 hadiths)
  - Sunan Abu Dawood (5,274 hadiths)
  - Jami' at-Tirmidhi (3,956 hadiths)
  - Sunan Ibn Majah (4,341 hadiths)
  - Sunan an-Nasa'i (5,761 hadiths)

- **Advanced Search**: Powerful search functionality with filters by collection, book, chapter, and authenticity
- **Multiple Languages**: Support for Arabic, English, and Urdu translations
- **Islamic Features**:
  - Daily Hadith recommendations
  - Islamic calendar integration
  - Prayer times calculator
  - Reading progress tracking

- **User Experience**:
  - Responsive mobile-friendly design
  - Progressive Web App (PWA) support
  - Dark/Light theme toggle
  - Customizable font sizes
  - Text-to-speech functionality
  - Social sharing capabilities

- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- Framer Motion for animations
- React Query for state management
- Wouter for routing

### Backend
- Express.js server
- JSON-based hadith data storage
- Session management
- WebSocket support for real-time features

### UI Components
- Shadcn/ui component library
- Lucide icons
- Recharts for data visualization

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ALIYASIR545/HadithVault.git
cd HadithVault
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
HadithVault/
├── client/                  # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── data/           # Hadith JSON data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
├── server/                 # Backend server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage layer
└── shared/                # Shared types and schemas
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Run production server
- `pnpm check` - Type checking with TypeScript

## Data Sources

The hadith collections are stored in JSON format and include:
- Arabic text
- English translations
- Urdu translations
- Book and chapter classifications
- Hadith numbers and references
- Authenticity grades

## License

MIT License - feel free to use this project for educational and personal purposes.

## Acknowledgments

Built with modern web technologies to make authentic Islamic knowledge accessible to everyone.

---

**Version**: 1.0.0
**Status**: Stable
**Last Updated**: November 2024
