import './globals.css';

import { MotionConfig as FramerMotionConfig, MotionGlobalConfig } from 'framer-motion';
import { cloneElement, PropsWithChildren, ReactElement, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import ErrorBoundary from '@/components/ErrorBoundary';
import raise from '@/helpers/raise';

MotionGlobalConfig.skipAnimations =
  import.meta.env.MODE === 'test' ||
  window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

const MotionConfig = ({ children }: PropsWithChildren) => {
  return (
    <FramerMotionConfig
      transition={{
        ease: 'easeOut',
        duration: 0.1,
      }}
    >
      {children}
    </FramerMotionConfig>
  );
};

const providers: Array<ReactElement<PropsWithChildren>> = [
  <BrowserRouter key={'BrowserRouter'} />,
  <MotionConfig key={'MotionConfig'} />,
];

const Config = ({ children }: PropsWithChildren) => {
  return (
    <>{providers.reduce<ReactNode>((a, v) => cloneElement(v, v.props, a), children)}</>
  );
};

const root =
  document.getElementById('root') ??
  raise(new Error("No element with id 'root' in DOM."));

createRoot(root).render(
  <ErrorBoundary>
    <Config>
      <App />
    </Config>
  </ErrorBoundary>,
);
