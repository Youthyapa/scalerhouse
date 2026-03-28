// components/ClientOnly.tsx
// Prevents hydration mismatch for components that render differently on server vs client
// (e.g. lucide-react SVG icons, browser-extension-modified DOM)
import { useEffect, useState, ReactNode } from 'react';

export default function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
