'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Providers from '@/lib/Providers';

const AreyBC = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const hasSidebar = pathname !== '/';

  return (
    <div className="">
      <Providers>
        <div className={`flex flex-col ${hasSidebar ? 'ml-44 p-12' : ''} bg-black`}>{children}</div>
      </Providers>
    </div>
  );
};

export default AreyBC;
