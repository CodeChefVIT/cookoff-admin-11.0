'use client';

import { env } from '@/env';

function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

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
                <GoogleIcon className="h-[22px] w-[22px]" />
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
