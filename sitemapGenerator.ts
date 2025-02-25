// @ts-ignore
const sitemap = require('nextjs-sitemap-generator')

try {
  sitemap({
    baseUrl: 'https://vaults.metric.one',
    pagesDirectory: `.next/server/pages`,
    targetDirectory: 'public/',
    ignoredPaths: ['/api', '404', '/[address]', '/terms', '/privacy', '/save'],
    // other apps routes from Vaults Suite
    extraPaths: ['/trade', '/blog'],
    nextConfigPath: `${__dirname}/next.config.js`,
    ignoreIndexFiles: true,
  })

  console.info(`✅ sitemap.xml generated!`)
} catch (err) {
  console.error('Something went wrong while generating sitemap')
}
