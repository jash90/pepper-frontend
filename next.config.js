/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pepper.pl', 
      'www.pepper.pl', 
      'static.pepper.pl',
      'example.com',
      'www.example.com',
      'cdn.pepper.pl',
      'img.pepper.pl',
      'a.allegroimg.com',
      'assets.allegrostatic.com',
      'prod-dcdn.mrgugu.com',
      'media.x-kom.pl',
      'images.morele.net',
      'f00.esfr.pl',
      'apollo-ireland.akamaized.net',
      'media.komputronik.pl',
      'mm.eu.audio-technica.com',
      'www.mediaexpert.pl',
      'www.neo24.pl',
      'mediamarkt.pl',
      'www.mediamarkt.pl',
      'saturn.pl',
      'www.saturn.pl'
    ],
  },
};

module.exports = nextConfig; 