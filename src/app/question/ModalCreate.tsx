import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const ACCENT_GREEN = '#1ba94c';
const BUTTON_TEXT_COLOR = 'text-black';
const PRIMARY_BUTTON_HOVER = `hover:bg-[#15803d]`;

const CreateButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <Button
      className={`mb-5 h-10 rounded-md px-4 font-semibold ${BUTTON_TEXT_COLOR} shadow-md transition-all duration-200 bg-[${ACCENT_GREEN}] ${PRIMARY_BUTTON_HOVER} shadow-[${ACCENT_GREEN}]/50`}
      onClick={() => {
        router.push('/question/create');
      }}
    >
      {children}
    </Button>
  );
};

export default CreateButton;
