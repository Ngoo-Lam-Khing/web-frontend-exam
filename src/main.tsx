import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './index.css';
import App from './App';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  await worker.start({
    serviceWorker: {
      url: `./mockServiceWorker.js`,
    },
  });
}
const queryClient = new QueryClient();
const theme = createTheme({
  typography: {
    fontFamily: "'Noto Sans TC', sans-serif",
    allVariants: {
      lineHeight: 1.25,
    },
  },
});
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
});
