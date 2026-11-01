// Bundles the whole site (React included) into dist/standalone.html, a single file you can open or preview anywhere.
// Run with: npm run preview:html
import { build } from 'esbuild';
import fs from 'node:fs';

const photo = fs.readFileSync('public/photo.jpg').toString('base64');

const result = await build({
  entryPoints: ['src/standalone.jsx'],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'error',
  plugins: [
    {
      name: 'inline-photo',
      setup(b) {
        b.onLoad({ filter: /src[\\/]photo\.js$/ }, () => ({
          contents: `export const PHOTO = "data:image/jpeg;base64,${photo}";`,
          loader: 'js',
        }));
      },
    },
  ],
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = fs.readFileSync('app/globals.css', 'utf8');
const fonts =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

const html = `<title>Shafkat H Muhit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${fonts}">
<style>${css}</style>
<script>document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('all-in')},4500);</script>
<div id="root"></div>
<script>${js}</script>
`;

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/standalone.html', html);
console.log('Wrote dist/standalone.html (' + Math.round(html.length / 1024) + ' KB)');
