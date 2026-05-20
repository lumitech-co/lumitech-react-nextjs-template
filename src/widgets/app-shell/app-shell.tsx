'use client';

import { ReactNode } from 'react';

import { useAppShellBootstrap } from './hooks';
import { ShellLoader } from './shell-loader';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface IAppShellProps {
  children: ReactNode;
}

export const AppShell = ({ children }: IAppShellProps) => {
  const { isInitialLoading } = useAppShellBootstrap();

  if (isInitialLoading) {
    return <ShellLoader />;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <TopBar />
        {children}
      </div>
    </div>
  );
};
