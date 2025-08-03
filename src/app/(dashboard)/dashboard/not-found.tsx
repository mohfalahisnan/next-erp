'use client';

import { Button } from '@/components/ui/button';
import { IconHome } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        onClick={() => router.push('/dashboard')}
        className="mt-4 flex items-center gap-2"
      >
        <IconHome className="h-4 w-4" />
        Return to Dashboard
      </Button>
    </div>
  );
}
