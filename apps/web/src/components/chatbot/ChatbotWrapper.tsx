'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/auth';
import SmartChatbot from './SmartChatbot';

export default function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

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
  const isSearchPage = pathname === '/demands';
  const isInvestmentPage = pathname === '/services/investment';

  // Determine context based on current page
  let context: 'general' | 'register' | 'search' | 'invest' = 'general';
  if (isRegisterPage) {
    context = 'register';
  } else if (isSearchPage) {
    context = 'search';
  } else if (isInvestmentPage) {
    context = 'invest';
  }

  // Use SmartChatbot for all pages with context-specific behavior
  return (
    <SmartChatbot 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
      context={context}
    />
  );
}