'use client';

import { useEffect, useState } from 'react';
import { Clock, Settings, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { FaPlay, FaPlus, FaStopCircle } from 'react-icons/fa';

import {
  getTime,
  resetRound,
  setTime,
  startRound,
  updateTime,
  type GetTimeResponse,
  type SetTimeParams,
  type UpdateTimeParams,
} from '@/api/timer';

const ACCENT_GREEN = '#1ba94c';
const ACCENT_COLOR = 'text-[#1ba94c]';
const CARD_BG = 'bg-[#182319]';
const INPUT_BG = 'bg-[#253026]';

interface DurationState {
  hours: number;
  minutes: number;
  seconds: number;
}

function Timer() {
  const [selectedRound, setSelectedRound] = useState('1');
  const [isRunning, setIsRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [timerData, setTimerData] = useState<GetTimeResponse | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [disableSetTime, setDisableSetTime] = useState(false);
  const [duration, setDuration] = useState<DurationState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [addTimeValue, setAddTimeValue] = useState<DurationState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  async function fetchTimer() {
    const data = await getTime();
    if (data) {
      setTimerData(data);
      const now = new Date(data.server_time).getTime();
      const end = new Date(data.round_end_time).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setRemainingSeconds(diff);
      setIsRunning(diff > 0);
      setDisableSetTime(diff > 0);
    } else {
      setTimerData(null);
      setRemainingSeconds(0);
      setIsRunning(false);
    }
  }

  useEffect(() => {
    void fetchTimer();
  }, []);

  useEffect(() => {
    let tick: NodeJS.Timeout | undefined;
    if (isRunning) {
      tick = setInterval(() => {
        setRemainingSeconds(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (tick) clearInterval(tick);
    };
  }, [isRunning]);

  useEffect(() => {
    const SYNC_INTERVAL_MS = 120000;
    let sync: NodeJS.Timeout | undefined;

    if (isRunning) {
      sync = setInterval(() => {
        void fetchTimer();
      }, SYNC_INTERVAL_MS);
    }

    return () => {
      if (sync) clearInterval(sync);
    };
  }, [isRunning]);

  const getDurationInSeconds = (d: DurationState): number =>
    d.hours * 3600 + d.minutes * 60 + d.seconds;

  const formatDurationForAPI = (d: DurationState): string => {
    const parts: string[] = [];
    if (d.hours > 0) parts.push(`${d.hours}h`);
    if (d.minutes > 0) parts.push(`${d.minutes}m`);
    if (d.seconds > 0) parts.push(`${d.seconds}s`);

    return parts.length > 0 ? parts.join('') : '0s';
  };

  async function handleSetTime() {
    const seconds = getDurationInSeconds(duration);

    const targetDate = new Date(Date.now() + seconds * 1000);
    const formattedTime = targetDate.toISOString();

    const payload: SetTimeParams = {
      round_id: selectedRound,
      time: formattedTime,
    };

    setDisableSetTime(true);
    await setTime(payload)
      .then(() => {
        toast.success(`Round ${selectedRound} time set to ${formatTime(seconds)}`);
      })
      .catch(() => {
        toast.error('Failed to set time. Please try again.');
      });
  }

  async function handleStartRound() {
    setIsStarting(true);
    await startRound();
    void fetchTimer();
    setIsStarting(false);
  }

  async function handleResetRound() {
    await resetRound();
    void fetchTimer();
    setIsStarting(false);
    setDisableSetTime(false);
  }

  async function handleAddTime() {
    const seconds = getDurationInSeconds(addTimeValue);

    if (seconds <= 0) return;

    const durationString = formatDurationForAPI(addTimeValue);

    const payload: UpdateTimeParams = {
      duration: durationString,
      round_id: selectedRound,
    };

    await updateTime(payload);

    setRemainingSeconds(prev => prev + seconds);

    void fetchTimer();
    setAddTimeValue({ hours: 0, minutes: 0, seconds: 0 });
  }

  function formatTime(sec: number): string {
    const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  const TimeInput = ({
    value,
    onChange,
    placeholder,
  }: {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <input
      type="number"
      min={0}
      placeholder={placeholder}
      className={`w-14 rounded-lg sm:w-16 ${INPUT_BG} border border-transparent p-2 text-center font-mono text-white placeholder-gray-500 focus:border-[${ACCENT_GREEN}] transition`}
      value={value}
      onChange={onChange}
    />
  );

  return (
    <div className={`flex min-h-screen flex-col items-center p-4 text-white`}>
      <h1
        className={`mb-8 mt-10 pb-2 text-center text-3xl font-extrabold uppercase tracking-widest sm:text-4xl ${ACCENT_COLOR} border-b border-[${ACCENT_GREEN}]/50`}
      >
        Timer Console
      </h1>

      <div className="flex w-full max-w-2xl flex-col items-center gap-6 p-2">
        <div className={`w-full rounded-xl ${CARD_BG} border border-gray-700 p-6`}>
          <div
            className={`mb-4 flex items-center space-x-2 text-lg font-bold uppercase ${ACCENT_COLOR}`}
          >
            <Settings size={20} />
            <span>Set Initial Round Time</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className={`w-28 rounded-lg ${INPUT_BG} border border-gray-600 p-2 text-white focus:border-[${ACCENT_GREEN}] transition`}
              value={selectedRound}
              onChange={e => setSelectedRound(e.target.value)}
            >
              <option value="1">ROUND 1</option>
              <option value="2">ROUND 2</option>
              <option value="3">ROUND 3</option>
            </select>

            <div className="flex items-center gap-1">
              <TimeInput
                value={duration.hours}
                onChange={e => setDuration({ ...duration, hours: Number(e.target.value) })}
                placeholder="HH"
              />
              <span>:</span>
              <TimeInput
                value={duration.minutes}
                onChange={e => setDuration({ ...duration, minutes: Number(e.target.value) })}
                placeholder="MM"
              />
              <span>:</span>
              <TimeInput
                value={duration.seconds}
                onChange={e => setDuration({ ...duration, seconds: Number(e.target.value) })}
                placeholder="SS"
              />
            </div>

            <button
              onClick={handleSetTime}
              disabled={disableSetTime}
              className={`ml-0 mt-3 whitespace-nowrap rounded-lg px-4 py-2 text-center font-semibold text-white transition sm:ml-2 sm:mt-0 ${
                disableSetTime
                  ? 'cursor-not-allowed bg-gray-500'
                  : `bg-[${ACCENT_GREEN}] hover:scale-105 hover:bg-[#15803d]`
              }`}
            >
              Set Duration
            </button>
            <button
              className={`ml-0 mt-3 whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-red-700 hover:text-white sm:ml-2 sm:mt-0`}
              onClick={handleResetRound}
            >
              Reset
            </button>
          </div>
        </div>

        <div
          className={`flex w-full flex-col items-center gap-6 rounded-xl border border-[${ACCENT_GREEN}] ${CARD_BG} p-6 shadow-[0_0_20px_rgba(27,169,76,0.3)]`}
        >
          <div className="flex w-full items-center justify-between">
            <div
              className={`flex items-center space-x-2 text-xl font-bold uppercase ${ACCENT_COLOR}`}
            >
              <Clock size={20} className={ACCENT_COLOR} />
              <span>Time Remaining</span>
            </div>
            <div className={`text-sm font-semibold uppercase text-white/70`}>
              Round: <span className={`${ACCENT_COLOR}`}>{selectedRound}</span>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-4">
            <div className={`font-mono text-4xl font-bold sm:text-6xl ${ACCENT_COLOR}`}>
              {formatTime(remainingSeconds)}
            </div>

            <button
              disabled={isStarting || isRunning}
              className={`rounded-lg px-6 py-3 font-bold uppercase text-white shadow-md transition-all duration-200 ${
                isStarting
                  ? 'cursor-not-allowed bg-gray-500'
                  : isRunning
                    ? 'cursor-not-allowed bg-gray-500' /* New: Use gray and disable hover effects */
                    : `bg-[${ACCENT_GREEN}] hover:scale-105 hover:bg-[#15803d]`
              }`}
              onClick={handleStartRound}
            >
              {isStarting ? (
                'Starting...'
              ) : isRunning ? (
                <div className="flex items-center gap-2">
                  <FaStopCircle size={24} />
                  <span className="hidden sm:inline">STOP</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaPlay size={20} />
                  <span className="hidden sm:inline">START</span>
                </div>
              )}
            </button>
          </div>

          <div className={`font-mono text-sm italic text-gray-400`}>
            Round End: {timerData ? new Date(timerData.round_end_time).toLocaleTimeString() : 'N/A'}
          </div>
        </div>

        <div className={`w-full rounded-xl ${CARD_BG} border border-gray-700 p-6`}>
          <div
            className={`mb-4 flex items-center space-x-2 text-lg font-bold uppercase ${ACCENT_COLOR}`}
          >
            <Zap size={20} />
            <span>Add Time (Live)</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <TimeInput
                value={addTimeValue.hours}
                onChange={e =>
                  setAddTimeValue({
                    ...addTimeValue,
                    hours: Number(e.target.value),
                  })
                }
                placeholder="HH"
              />
              <span>:</span>
              <TimeInput
                value={addTimeValue.minutes}
                onChange={e =>
                  setAddTimeValue({
                    ...addTimeValue,
                    minutes: Number(e.target.value),
                  })
                }
                placeholder="MM"
              />
              <span>:</span>
              <TimeInput
                value={addTimeValue.seconds}
                onChange={e =>
                  setAddTimeValue({
                    ...addTimeValue,
                    seconds: Number(e.target.value),
                  })
                }
                placeholder="SS"
              />
            </div>

            <button
              className={`flex items-center justify-center rounded-lg bg-[${ACCENT_GREEN}]/70 p-3 transition sm:p-2.5 hover:bg-[${ACCENT_GREEN}] hover:text-black`}
              onClick={handleAddTime}
            >
              <FaPlus size={20} className="sm:mr-2" />
              <span className="hidden font-semibold sm:inline">Add to Timer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;
