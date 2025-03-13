# Pepper.pl Deal Finder

A Next.js application that scrapes and displays the latest deals from Pepper.pl.

## Features

- Shows the latest deals from Pepper.pl
- Displays product information, including:
  - Title
  - Price
  - Shipping cost
  - Image
  - Description
- Load more functionality to browse more deals
- Responsive design

## Technologies Used

- Next.js
- React
- TypeScript
- Puppeteer (for web scraping)
- Cheerio (for HTML parsing)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
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

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. The application uses Puppeteer to scrape deals from Pepper.pl
2. The scraper runs on the server-side through Next.js API routes
3. The frontend displays the scraped data in a user-friendly interface
4. Users can load more deals by clicking the "Load More" button

## OpenAI Integration

This application can use OpenAI's GPT models to categorize deals for more accurate results. To enable this feature:

1. Get an API key from [OpenAI's platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory (if it doesn't exist)
3. Add your API key to the file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Restart the development server

When the OpenAI API key is configured, the application will automatically use GPT for categorization. If the key is not set, it will fall back to the keyword-based categorization system.

Note: Using the OpenAI API will incur costs based on your API usage. The application is designed to minimize API calls by processing articles in batches.

## Supabase Cache Integration

To enable caching of categorized articles with Supabase:

1. Create a Supabase account and project at [https://supabase.com](https://supabase.com)
2. Create a `categorized_articles` table with the following SQL:

```sql
CREATE TABLE categorized_articles (
  article_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  shipping_price TEXT,
  image TEXT,
  link TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Enable Row Level Security (RLS) for the `categorized_articles` table:

```sql
-- Włączenie RLS dla tabeli cache
ALTER TABLE categorized_articles ENABLE ROW LEVEL SECURITY;

-- Polityka odczytu danych - tylko wiersze z ostatnich 30 dni
CREATE POLICY "Tylko odczyt danych cache z ostatnich 30 dni" 
ON categorized_articles
FOR SELECT 
USING (created_at > now() - interval '30 days');

-- Polityka dodawania danych - tylko konto serwisowe może dodawać dane
CREATE POLICY "Tylko serwis może dodawać dane do cache"
ON categorized_articles
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Polityka aktualizacji danych - tylko konto serwisowe może aktualizować dane
CREATE POLICY "Tylko serwis może aktualizować dane w cache"
ON categorized_articles
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Polityka usuwania danych - tylko konto serwisowe może usuwać dane
CREATE POLICY "Tylko serwis może usuwać dane z cache"
ON categorized_articles
FOR DELETE
USING (auth.role() = 'service_role');
```

4. Get your Supabase URL and keys from your project settings
5. Add your Supabase credentials to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

6. Restart the development server

The application will now:
- Check the cache before making OpenAI API calls
- Store newly categorized articles in the cache
- Display cache status in the UI
- Respect Row Level Security policies:
  - Public access only to recent cache data (< 30 days old)
  - Only server-side API endpoints can write/modify data
  - Cache is automatically cleaned (older than 30 days)

### Testing RLS

To test if your RLS policies are working correctly:

1. Make sure your Supabase credentials are properly set up in `.env.local`
2. Visit `/api/test-rls` in your browser
3. Review the results to ensure policies are enforced as expected

## Combined OpenAI and Supabase

Using both OpenAI and Supabase together provides:
- Smart categorization with AI
- Performance improvements through caching
- Reduced API costs
- Secure data access with Row Level Security
- Automatic data expiration for older entries

## Rozwiązywanie problemów

### Problem z URL w API Routes

Jeśli napotkasz błędy związane z nieprawidłowym adresem URL podczas sprawdzania lub zapisywania do cache:

```
Error checking cache: TypeError: Failed to parse URL from /api/cache/lookup
```

Upewnij się, że zmienna `NEXT_PUBLIC_BASE_URL` jest poprawnie skonfigurowana w pliku `.env.local`:

- W środowisku lokalnym: `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- W środowisku produkcyjnym: `NEXT_PUBLIC_BASE_URL=https://twoja-domena.com`

Jest to niezbędne, ponieważ w środowisku serwerowym (API routes) funkcja `fetch()` wymaga pełnych, absolutnych URL-i, a nie ścieżek relatywnych.

### Błąd "414 Request-URI Too Large"

Jeśli widzisz błąd:

```
414 Request-URI Too Large
```

Oznacza to, że przekroczono limit długości URL podczas sprawdzania dużej liczby artykułów w cache. Aplikacja automatycznie rozwiązuje ten problem używając metody POST zamiast GET, więc upewnij się, że korzystasz z najnowszej wersji kodu.

### Błąd "Failed to store in cache: {"error":"requested path is invalid"}"

Ten błąd wskazuje na nieprawidłowy URL podczas zapisywania do cache. Upewnij się, że wszystkie zmienne środowiskowe są poprawnie skonfigurowane.

## Disclaimer

This application is for educational purposes only. Please respect Pepper.pl's terms of service and robots.txt when using this application. Web scraping may be against the terms of service of some websites, so use this responsibly.

## Project Structure

```
pepper-nextjs/
├── app/                   # Next.js App Router structure
│   ├── about/             # About page
│   ├── components/        # React components
│   ├── lib/               # Utility functions and API services
│   ├── types/             # TypeScript type definitions
│   ├── globals.css        # Global CSS styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page component
│   └── providers.tsx      # React context providers
├── public/                # Static assets
├── sql/                   # SQL scripts for database setup
├── .env.local             # Environment variables (create from .env.local.example)
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS configuration for Tailwind
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
``` 