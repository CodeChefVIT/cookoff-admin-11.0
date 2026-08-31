'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaChartLine, FaClock, FaHome, FaQuestion, FaUser } from 'react-icons/fa';

import cookoff from '@/assets/images/codechef_logo.svg';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const DARK_BG = 'bg-[#0E150F]';
const HOVER_BG = 'hover:bg-[#182319]';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: FaHome,

      isActive: pathname === '/dashboard',
    },
    {
      name: 'Questions',
      path: '/question',
      icon: FaQuestion,

      isActive: pathname.startsWith('/question'),
    },
    {
      name: 'Users',
      path: '/users',
      icon: FaUser,
      isActive: pathname === '/users',
    },
    {
      name: 'Timer',
      path: '/timer',
      icon: FaClock,
      isActive: pathname === '/timer',
    },
    {
      name: 'Leader',
      path: '/leaderboard',
      icon: FaChartLine,
      isActive: pathname === '/leaderboard',
    },
  ];

  const getLinkClasses = (isActive: boolean) => {
    const baseClasses = `m-2 mx-3 rounded-md p-3 text-left text-lg transition-all duration-150`;
    if (isActive) {
      return `${baseClasses} bg-[${ACCENT_GREEN}]/20 border border-[${ACCENT_GREEN}] ${ACCENT_COLOR_TEXT} font-semibold`;
    } else {
      return `${baseClasses} text-white/90 border border-transparent ${HOVER_BG} hover:${ACCENT_COLOR_TEXT}`;
    }
  };

  return (
    <nav
      className={`${pathname === '/' ? 'hidden' : 'flex'} fixed z-10 float-left flex h-screen w-52 flex-col border-r border-[${ACCENT_GREEN}]/20 ${DARK_BG} transition-all duration-300`}
    >
      <div
        className={`flex items-center gap-2 p-4 pt-6 text-xl font-bold uppercase tracking-wider ${ACCENT_COLOR_TEXT}`}
      >
        <Image
          className="border-r border-gray-600 pr-2"
          src={cookoff as HTMLImageElement}
          alt="cookoff text"
          width={40}
          height={40}
        />
        COOK OFF
      </div>

      <div className="mt-8 flex flex-col gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
              }}
              className={getLinkClasses(item.isActive)}
            >
              <div className="flex items-center gap-3">
                <Icon className={item.isActive ? '' : `text-white/60 hover:${ACCENT_COLOR_TEXT}`} />
                {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
