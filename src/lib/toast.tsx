import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import toast, { type Toast } from 'react-hot-toast';

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
  {
    variants: {
      type: {
        success: 'border-l-4 border-green-500',
        error: 'border-l-4 border-red-500',
        info: 'border-l-4 border-blue-500',
      },
    },
    defaultVariants: {
      type: 'info',
    },
  }
);

const useToast = () => {
  const create = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    toast.custom((t: Toast) => (
      <div
        className={`${toastVariants({ type })} ${t.visible ? 'animate-enter' : 'animate-leave'}`}
      >
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="flex min-h-12 min-w-12 items-center justify-center overflow-hidden object-fill p-2">
              <Image className="" src="/cc-logo.svg" alt="CodeChef-VIT" height={48} width={48} />
            </div>
            <div className="my-auto ml-3 flex h-full flex-1 items-center">
              <div>
                <p className="text-sm font-semibold text-white">
                  {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}
                </p>
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => toast.remove(t.id)}
            className="mx-3 flex w-full items-center justify-center rounded-none rounded-r-lg border-transparent p-2 text-sm font-medium text-black"
          >
            <X />
          </button>
        </div>
      </div>
    ));
  };

  return { create };
};

export default useToast;
