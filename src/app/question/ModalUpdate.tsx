import { useRouter } from 'next/navigation';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR_TEXT = 'text-[#1ba94c]';
const HOVER_BG = `hover:bg-[${ACCENT_GREEN}]/10`;

const ModalUpdate = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div
      className={`flex w-full cursor-pointer justify-start rounded-md p-1 pl-1 text-left text-sm transition-colors duration-150 ${ACCENT_COLOR_TEXT} ${HOVER_BG}`}
      onClick={() => {
        router.push(`/question/create/${id}`);
      }}
    >
      {children}
    </div>
  );
};

export default ModalUpdate;
