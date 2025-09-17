'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import SmartChatbot from './SmartChatbot';
import IntelligentChatbot from './IntelligentChatbot';
import SimpleChatbot from './SimpleChatbot';

export default function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  // Auto-open chatbot for new users on register page
  useEffect(() => {
    if (pathname === '/technologies/register') {
      const hasSeenRegisterChatbot = localStorage.getItem('hanotex-register-chatbot-seen');
      if (!hasSeenRegisterChatbot) {
        setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('hanotex-register-chatbot-seen', 'true');
        }, 2000); // Show after 2 seconds for register page
      }
    }
  }, [pathname]);

  const isRegisterPage = pathname === '/technologies/register';
  const isGeneralPage = !isRegisterPage;

  // Use SmartChatbot for all pages with context-specific behavior
  return (
    <SmartChatbot 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
      context={isRegisterPage ? "register" : context}
    />
  );
}
