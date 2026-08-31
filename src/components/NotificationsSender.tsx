'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Bell, Send } from 'lucide-react';
import toast from 'react-hot-toast';

import { db } from '@/utils/firebase.utils';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';

export default function NotificationsSender() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendNotification = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'notifications'), {
        message: message.trim(),
        createdAt: serverTimestamp(),
      });

      setMessage('');
      toast.success('✅ Notification sent!');
    } catch (error) {
      console.error('Error adding notification: ', error);
      toast.error('❌ Failed to send notification. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const isMessageEmpty = !message.trim();

  return (
    <div className="w-full p-6">
      <div
        className={`space-y-5 rounded-xl border border-[${ACCENT_GREEN}]/30 ${CARD_BG} p-6 shadow-xl`}
      >
        <div className={`flex items-center border-b border-[${ACCENT_GREEN}]/50 pb-4 text-white`}>
          <Bell className={`mr-3 h-6 w-6 ${ACCENT_COLOR}`} />
          <h2 className={`text-xl font-bold uppercase tracking-wider ${ACCENT_COLOR}`}>
            Send Global Notification
          </h2>
        </div>

        <div className="relative">
          <textarea
            rows={4}
            placeholder="Enter a message for all users..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={`w-full resize-none rounded-lg border border-gray-600 ${INPUT_BG} p-4 text-white placeholder-gray-500 transition-all focus:border-[${ACCENT_GREEN}] focus:outline-none focus:ring-2 focus:ring-[${ACCENT_GREEN}]`}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={sendNotification}
            disabled={loading || isMessageEmpty}
            className={`flex items-center justify-center space-x-2 rounded-lg px-6 py-2.5 font-semibold text-black shadow-lg transition-all duration-200 ${
              loading || isMessageEmpty
                ? 'cursor-not-allowed bg-gray-700 text-gray-400'
                : `transform bg-[${ACCENT_GREEN}] shadow-md shadow-[${ACCENT_GREEN}]/50 hover:scale-[1.01] hover:bg-[#15803d]`
            } `}
          >
            {loading ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Notify Users</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
