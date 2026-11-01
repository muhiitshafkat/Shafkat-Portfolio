// Entry used only by `npm run preview:html`, which bundles the whole site into one HTML file.
import { createRoot } from 'react-dom/client';
import Portfolio from './components/Portfolio';

createRoot(document.getElementById('root')).render(<Portfolio />);
