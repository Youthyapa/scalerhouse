// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';
import { CurrencyProvider } from '../components/context/CurrencyContext';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import AnimatedBackground from '../components/AnimatedBackground';
import SocialFloatBar from '../components/layout/SocialFloatBar';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <CurrencyProvider>
                <AnimatedBackground />
                <SocialFloatBar />
                <Component {...pageProps} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: 'custom-toast',
                        duration: 3000,
                        style: {
                            background: '#0f1f3d',
                            color: '#f1f5f9',
                            border: '1px solid rgba(0,212,255,0.2)',
                            borderRadius: '12px',
                        },
                    }}
                />
            </CurrencyProvider>
        </AuthProvider>
    );
}
