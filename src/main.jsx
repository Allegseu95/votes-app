import React from 'react';
import ReactDOM from 'react-dom/client';
import { Flowbite } from 'flowbite-react';
import { Toaster } from 'sonner';

import { App } from '@/App';

import 'animate.css';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Flowbite>
      <Toaster position='top-right' richColors closeButton />
      <App />
    </Flowbite>
  </React.StrictMode>
);
