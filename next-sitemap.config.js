/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pepper.raccoonsoftware.pl',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
} 