'use client';

import { FaGoogle } from 'react-icons/fa';

import { env } from '@/env';

const ACCENT_GREEN = '#1ba94c';
const HEADER_TEXT_COLOR = `text-[${ACCENT_GREEN}]`;
const LOGIN_CARD_OUTER_COLOR = 'bg-[#4a4a4a]';
const LOGIN_CARD_INNER_COLOR = 'bg-black';

const BACKGROUND_COLOR = 'bg-[#202020]';

export default function Login() {
  const trapezoidClipPath = 'polygon(0 8%, 8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%)';

  return (
    <div
      className={`min-w-screen flex min-h-screen flex-col justify-between ${BACKGROUND_COLOR} text-white`}
    >
      <h1
        className={`s-sling pt-8 text-center text-3xl font-bold uppercase tracking-widest ${HEADER_TEXT_COLOR}`}
      >
        CODECHEF PRESENTS
      </h1>

      <div className="flex w-full flex-1 items-center justify-around py-10">
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`s-sling text-[70px] font-bold uppercase tracking-widest text-white lg:text-9xl ${HEADER_TEXT_COLOR}`}
          >
            COOK OFF
          </h1>
          <h1
            className={`s-sling mt-4 text-[70px] font-bold uppercase tracking-widest ${HEADER_TEXT_COLOR}`}
          >
            11.0
          </h1>
        </div>

        <div className="flex min-w-[450px] items-center justify-center">
          <div
            className={`relative flex h-[480px] w-[450px] flex-col items-center justify-center ${LOGIN_CARD_OUTER_COLOR}`}
            style={{
              clipPath: trapezoidClipPath,
              padding: '3px',
            }}
          >
            <div
              className={`flex h-full w-full flex-col items-center justify-center ${LOGIN_CARD_INNER_COLOR} text-white`}
              style={{
                clipPath: trapezoidClipPath,
              }}
            >
              <h1 className="s-sling mb-10 text-3xl font-bold uppercase tracking-wider text-white">
                ADMIN LOGIN
              </h1>
              <button
                onClick={() => {
                  window.location.href = `${env.NEXT_PUBLIC_API_URL}/api/v1/auth/google?portal=admin`;
                }}
                type="button"
                className="flex w-[320px] items-center justify-center gap-3 rounded-md bg-white p-4 text-lg font-semibold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              >
                <FaGoogle size={22} />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>

      <h1
        className={`s-sling pb-8 text-center text-3xl font-bold uppercase tracking-widest ${HEADER_TEXT_COLOR}`}
      >
        A COOKING COMPETITION
      </h1>
    </div>
  );
}
