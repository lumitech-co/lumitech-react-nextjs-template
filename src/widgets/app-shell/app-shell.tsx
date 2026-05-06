'use client';

import { ReactNode } from 'react';

import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface IAppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: IAppShellProps) => (
  <div className="app">
    <Sidebar />
    <div className="main">
      <TopBar />
      {children}
    </div>
  </div>
);
