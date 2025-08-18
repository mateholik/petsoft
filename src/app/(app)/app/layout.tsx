import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import BackgroundPattern from '@/components/BackgroundPattern';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundPattern />
      <div className='max-w-[1050px] mx-auto px-4'>
        <AppHeader />
        {children}
        <AppFooter />
      </div>
    </>
  );
}
