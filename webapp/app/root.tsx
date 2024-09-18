import './globals.css';

import { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig as FramerMotionConfig, MotionGlobalConfig } from 'framer-motion';
import React, {
  cloneElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
} from 'react';

import stylesheet from '@/globals.css?url';

export const queryClient = new QueryClient();

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

const MotionConfig = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    MotionGlobalConfig.skipAnimations = window?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )?.matches;
  }, []);
  return (
    <FramerMotionConfig
      transition={{
        ease: 'easeOut',
        duration: 0.25,
      }}
    >
      {children}
    </FramerMotionConfig>
  );
};

const providers: Array<ReactElement<PropsWithChildren>> = [
  <QueryClientProvider key={'QueryClientProvider'} client={queryClient} />,
  <MotionConfig key={'MotionConfig'} />,
];

const Config = ({ children }: PropsWithChildren) => {
  return (
    <>{providers.reduce<ReactNode>((a, v) => cloneElement(v, v.props, a), children)}</>
  );
};

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang={'en'}>
      <head>
        <title>Banan</title>
        <meta charSet={'utf-8'} />
        <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
        <Meta />
        <Links />
      </head>
      <body className={'bg-gray-300 text-primary-dark h-screen relative'}>
        <script
          async
          defer
          dangerouslySetInnerHTML={{
            __html: `
              const n="http://localhost:6001",r=(e)=>{const o=console.error;window.console.error=(...t)=>{fetch(\`\${n}/\${e}/error\`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),o(...t)}},i=(e)=>{let o=document.location.href;const t=document.body;new MutationObserver(()=>{o!==document.location.href&&(fetch(\`\${n}/\${e}/pageView\`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:o,to:document.location.href})}),o=document.location.href)}).observe(t,{childList:!0,subtree:!0})},c=(e)=>{fetch(\`\${n}/\${e}/load\`,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"}})},s=(e)=>{c(e),r(e),i(e)};window.initializeIngest=s;
            `,
          }}
        />
        <script
          async
          defer
          dangerouslySetInnerHTML={{
            __html: `
                initializeIngest("eyJhbGciOiJIUzI1NiJ9.eyJwcm9qZWN0SWQiOiI5ODk2ZjBmMi0wYWY0LTRjN2QtOWU5YS00OGNkN2UyOGY4MjIifQ.uNQM-TIXWJvRS1mrhjblBQPeJO-urt0qQH4jRam3P1g");
              `,
          }}
        />
        <div className={'h-full relative z-0'} id={'root'}>
          {/*<ErrorBoundary>*/}
          <Config>
            {children}
            <Scripts />
          </Config>
          {/*</ErrorBoundary>*/}
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
