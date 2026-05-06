'use client';

import { ReactNode, useState } from 'react';

import { RouteId, Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface IAppShellProps {
  children: ReactNode;
  initialRoute?: RouteId;
}

export const AppShell = ({
  children,
  initialRoute = 'dashboard',
}: IAppShellProps) => {
  const [route, setRoute] = useState<RouteId>(initialRoute);

  return (
    <div className="app">
      <Sidebar activeRoute={route} onRouteChange={setRoute} />
      <div className="main">
        <TopBar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
