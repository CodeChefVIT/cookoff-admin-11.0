'use client';

import { useState } from 'react';
import { type ApiError } from 'next/dist/server/api-utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type * as z from 'zod';

import { login } from '@/api/login';
import cookoff from '@/assets/images/cookoff.svg';
import { loginFormSchema } from '@/schemas/forms/login';

const ACCENT_GREEN = '#1ba94c';
const HEADER_TEXT_COLOR = `text-[${ACCENT_GREEN}]`;
const LOGIN_CARD_OUTER_COLOR = 'bg-[#4a4a4a]';
const LOGIN_CARD_INNER_COLOR = 'bg-black';

const INPUT_FIELD_COLOR = 'bg-[#4e4e4e]';
const BACKGROUND_COLOR = 'bg-[#202020]';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    try {
      await toast.promise(login(data), {
        loading: 'Cooking...',
        success: 'Logged in successfully!',
        error: (err: ApiError) => err.message,
      });
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      console.error('Login failed:', err);
    }
    setIsLoading(false);
  }

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
          <Image
            src={cookoff as HTMLImageElement}
            alt="cookoff text"
            width={700}
            height={500}
            className="max-w-[60vw] object-contain lg:max-w-[45vw]"
          />
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
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center gap-2">
                <input
                  {...register('email')}
                  type="text"
                  className={`w-[350px] rounded-sm ${INPUT_FIELD_COLOR} p-4 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[${ACCENT_GREEN}] text-white`}
                  placeholder="Enter Username"
                  required
                />
                {errors?.email?.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}

                <div className="relative mt-4">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className={`w-[350px] rounded-sm ${INPUT_FIELD_COLOR} p-4 pr-12 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[${ACCENT_GREEN}] text-white`}
                    placeholder="Enter Password"
                    required
                  />
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-black transition-colors hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
                {errors?.password?.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}

                <button
                  type="submit"
                  className={`s-sling mt-8 w-[120px] rounded-md bg-[#1ba94c] p-3 font-bold uppercase tracking-wider text-black transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#1ba94c]/50 ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="h-5 w-5 animate-spin text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="#1ba94c"
                          strokeWidth="4"
                        ></circle>

                        <path
                          className="opacity-75"
                          fill="#182319"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Cooking...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
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
