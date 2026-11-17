'use client';

import React, { useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { useLanguage } from '@/hooks/useLanguage';
import { Volume2, VolumeX, Pause, Play, Square, Gauge } from 'lucide-react';

interface ListenButtonProps {
  textToRead: string;
  className?: string;
  size?: 'normal' | 'large';
}

export default function ListenButton({ textToRead, className = '', size = 'normal' }: ListenButtonProps) {
  const { language, t, isEasyMode } = useLanguage();
  const { speak, pause, resume, stop, isPlaying, isPaused, currentText, speed, changeSpeed, voiceNotice } = useSpeech();
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const cleanInput = textToRead
    .replace(/[*#_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const isCurrentActive = isPlaying && currentText === cleanInput;
  const isLarge = size === 'large' || isEasyMode;

  const handleMainClick = () => {
    if (isCurrentActive) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(cleanInput, language);
    }
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-teal-50 border border-teal-200/80 shadow-sm">
        {/* Main Play / Pause Button */}
        <button
          type="button"
          onClick={handleMainClick}
          aria-label={
            isCurrentActive && !isPaused
              ? t.tts.pause
              : isCurrentActive && isPaused
              ? t.tts.resume
              : t.tts.listen
          }
          className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all ${
            isLarge
              ? 'px-4 py-2.5 text-base sm:text-lg min-h-[48px]'
              : 'px-3 py-1.5 text-sm min-h-[38px]'
          } ${
            isCurrentActive && !isPaused
              ? 'bg-teal-600 text-white shadow-md animate-pulse'
              : 'bg-white hover:bg-teal-100/60 text-teal-800'
          }`}
        >
          {isCurrentActive && !isPaused ? (
            <>
              <Pause className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
              <span>{t.tts.pause}</span>
            </>
          ) : isCurrentActive && isPaused ? (
            <>
              <Play className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
              <span>{t.tts.resume}</span>
            </>
          ) : (
            <>
              <Volume2 className={isLarge ? 'w-5 h-5 text-teal-600' : 'w-4 h-4 text-teal-600'} />
              <span>{t.tts.listen}</span>
            </>
          )}
        </button>

        {/* Stop button when active */}
        {isCurrentActive && (
          <button
            type="button"
            onClick={stop}
            title={t.tts.stop}
            aria-label={t.tts.stop}
            className="p-1.5 text-teal-700 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
          >
            <Square className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        )}

        {/* Speed Selector Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            title={`${t.tts.speed}: ${speed}x`}
            aria-label={`${t.tts.speed} (${speed}x)`}
            className={`px-2 py-1 text-xs font-semibold rounded-lg bg-teal-100/70 hover:bg-teal-200/80 text-teal-800 transition-colors flex items-center gap-1 ${
              isLarge ? 'h-9 px-2.5 text-sm' : 'h-7'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{speed}x</span>
          </button>

          {showSpeedMenu && (
            <div className="absolute top-full mt-1.5 right-0 z-20 bg-white border border-teal-200 shadow-lg rounded-xl p-1 flex flex-col gap-1 min-w-[70px]">
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    changeSpeed(rate);
                    setShowSpeedMenu(false);
                  }}
                  className={`px-2 py-1 text-xs rounded-lg text-left transition-colors font-medium ${
                    speed === rate
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-700 hover:bg-teal-50'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Voice Warning Notice if browser lacks Urdu voice */}
      {voiceNotice && isCurrentActive && (
        <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 max-w-xs">
          {voiceNotice}
        </p>
      )}
    </div>
  );
}
