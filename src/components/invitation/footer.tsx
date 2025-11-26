'use client';

import { useState } from 'react';
import Link from 'next/link';
// import { AdminLoginModal } from '@/components/admin/login-modal';

export function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    // This is a simplified version. For a real app, use a more robust solution.
    // The admin page is not implemented in this version.
    const now = Date.now();
    let newClickCount;

    if (now - lastClick > 1000) { // reset if clicks are too far apart
      newClickCount = 1;
    } else {
      newClickCount = clickCount + 1;
    }
    
    setClickCount(newClickCount);
    setLastClick(now);

    if (newClickCount >= 3) {
      // In a real implementation, this would open a modal.
      // For now, it will just log to the console.
      console.log("Admin access triggered. Implement AdminLoginModal and /admin page.");
      // setIsModalOpen(true);
      setClickCount(0);
    }
  };

  return (
    <>
      <footer className="text-center py-8 mt-16 relative">
        <p className="text-xs text-foreground/40 cursor-pointer" onClick={handleClick}>
          Powered by ZazziLabs
        </p>
      </footer>
      {/* <AdminLoginModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} /> */}
    </>
  );
}
