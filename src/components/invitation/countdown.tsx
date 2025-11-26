'use client';

import { useState, useEffect } from 'react';
import { intervalToDuration, isPast } from 'date-fns';

const CountdownItem = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg p-4 w-20 h-20 md:w-28 md:h-28 border border-primary/10 shadow-inner">
    <span className="font-headline text-3xl md:text-5xl text-primary font-bold">{String(value).padStart(2, '0')}</span>
    <span className="font-body text-xs md:text-sm text-primary/80 uppercase tracking-widest">{label}</span>
  </div>
);

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [remaining, setRemaining] = useState(intervalToDuration({
    start: new Date(),
    end: targetDate,
  }));
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (isPast(targetDate)) {
      setIsOver(true);
      return;
    }

    const interval = setInterval(() => {
      const duration = intervalToDuration({
        start: new Date(),
        end: targetDate,
      });

      if (isPast(targetDate)) {
        clearInterval(interval);
        setIsOver(true);
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setRemaining(duration);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isOver) {
    return (
      <section className="py-16 md:py-24">
        <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">O grande dia chegou!</h2>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <h2 className="font-headline text-3xl md:text-4xl text-primary mb-8">Contagem Regressiva</h2>
      <div className="flex justify-center gap-2 md:gap-6">
        <CountdownItem value={remaining.days ?? 0} label="Dias" />
        <CountdownItem value={remaining.hours ?? 0} label="Horas" />
        <CountdownItem value={remaining.minutes ?? 0} label="Minutos" />
        <CountdownItem value={remaining.seconds ?? 0} label="Segundos" />
      </div>
    </section>
  );
}
