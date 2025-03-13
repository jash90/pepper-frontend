# Pepper Deal Finder

A modern Next.js application that displays the latest deals from Pepper.pl, built with performance and user experience in mind.

![Pepper Deal Finder Screenshot](public/screenshot.png)

## ✨ Features

- **Category-Based Organization**: Deals are automatically organized by category
- **Multiple Category Filtering**: Select several categories to view specific deals
- **Responsive Search**: Instantly filter deals by keywords
- **Vertical Category Layout**: Categories are arranged vertically with horizontally displayed articles
- **Modern UI**: Clean, responsive design with smooth transitions and animations
- **Server-Side API Proxy**: Avoids CORS issues when accessing the Pepper backend

## 🚀 Technologies Used

- **Next.js 13+** with App Router
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **React Query** for efficient data fetching and caching
- **Framer Motion** for animations
- **Zod** for data validation

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pepper-nextjs.git
   cd pepper-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏗️ Project Structure

```
pepper-nextjs/
├── app/                    # Next.js App Router structure
│   ├── api/                # API routes (including CORS proxy)
│   │   └── articles/       # Articles API endpoint
│   ├── components/         # Reusable React components
│   │   ├── ArticleCard.tsx # Article display component
│   │   ├── CategorySection.tsx # Category container component
│   │   └── ...             # Other UI components
│   ├── lib/                # Utility functions and API services
│   │   └── api.ts          # API client for data fetching
│   ├── types/              # TypeScript type definitions
│   ├── globals.css         # Global CSS with Tailwind
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Home page component
│   └── providers.tsx       # React context providers
├── public/                 # Static assets
├── .env.local.example      # Example environment variables
├── .gitignore              # Git ignore file
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🌟 Key Features Explained

### Vertical Category Layout

Categories are displayed vertically, with articles arranged horizontally within each category section. This provides:
- Better organization of content
- More efficient use of screen space
- Improved readability for article details

### Multiple Category Filtering

The app allows selecting multiple category filters at once:
- Click any category to select/deselect it
- Filter buttons show which categories are active
- Selected categories display below the filter options
- Clear all filters with a single click

### Responsive Article Cards

Articles adapt their layout based on screen size and context:
- Horizontal layout with image on the left and details on the right
- Proper aspect ratio for images
- Price tags and shipping information clearly displayed

### CORS-Free API Access

The app includes a server-side proxy to avoid CORS issues:
- API requests are routed through Next.js API routes
- Client-side code doesn't directly access external APIs
- Maintains security while enabling access to external data

## 🧠 How It Works

1. The application fetches categorized article data through the API proxy route
2. Articles are automatically organized by category and displayed in collapsible sections
3. Users can search, filter by category, and expand/collapse sections
4. Article cards link directly to the original Pepper.pl deals

## 📱 Responsive Design

The application is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

The layout automatically adjusts based on screen size, ensuring a great user experience on any device.

## 🛣️ Roadmap

Future improvements planned for this project:

- [ ] Dark mode toggle
- [ ] Favorites/bookmarking functionality
- [ ] Price history tracking
- [ ] User authentication
- [ ] Personalized deal recommendations

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational purposes only. Please respect Pepper.pl's terms of service when using this application. 