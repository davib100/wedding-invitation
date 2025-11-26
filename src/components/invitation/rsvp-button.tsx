"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RsvpModal } from './rsvp-modal';
import { HeartHandshake } from 'lucide-react';

export function RsvpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-transform hover:scale-105">
        <HeartHandshake className="mr-2 h-5 w-5" />
        Confirmar Presença
      </Button>
      <RsvpModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
