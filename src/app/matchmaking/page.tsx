'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MatchmakingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="container mx-auto py-20 text-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
