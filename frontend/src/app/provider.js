
"use client"; // This is the most important line

import { SnackbarProvider } from 'notistack';
import { NotificationProvider } from '../context/NotificationContext';

export function Providers({ children }) {
    return (
        // notistack's provider now wraps the NotificationProvider
        <SnackbarProvider className='mt-20'>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </SnackbarProvider>
    )
}


/* 
  [Backend: Message Controller] -> [Backend: SSE Routes Push]
                        ↓
  `[Frontend: EventSource is listening...]`
                        ↓
  [Frontend: NotificationContext onmessage handler catches event]
                        ↓
  1. Updates notification list state (for bell icon)
  2. Calls enqueueSnackbar("New mention...")
                        ↓
  [Frontend: notistack's SnackbarProvider receives the call]
                        ↓
  `[Frontend: notistack renders the visual pop-up on screen]`
*/