import { Copy } from 'lucide-react';

import useToast from '@/lib/toast';

const ModalDetailText = ({
  label,
  content,
  copyable,
}: {
  label: string;
  content: string | undefined;
  copyable?: boolean;
}) => {
  const toast = useToast();

  const handleCopy = () => {
    if (content) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          toast.create('Copied to Clipboard ', 'success');
        })
        .catch(error => {
          toast.create('Failed to copy', 'error');

          console.error(error);
        });
    }
  };
  return (
    <p className="flex w-fit flex-row items-center gap-1 whitespace-nowrap text-sm">
      <span className="">{label}</span>
      <span>{content}</span>
      {copyable && content && (
        <span>
          <Copy onClick={handleCopy} size={16} className="hover:cursor-pointer" />
        </span>
      )}
    </p>
  );
};

export default ModalDetailText;
