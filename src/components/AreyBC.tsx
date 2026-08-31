'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Providers from '@/lib/Providers';

const AreyBC = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="">
      <Providers>
        <div className={`ml- flex flex-col ${pathname !== '/' ? 'ml-44 p-12' : ''} bg-black`}>
          {children}
        </div>
      </Providers>
    </div>
  );
};

export default AreyBC;
