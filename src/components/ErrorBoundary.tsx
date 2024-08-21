import { Component, ErrorInfo, PropsWithChildren, useMemo } from 'react';

type ErrorBoundaryStateProps = {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
};

/**
 * This is the debug error boundary. It should not be used in production.
 */
export default class ErrorBoundary extends Component<
  PropsWithChildren<void>,
  ErrorBoundaryStateProps
> {
  constructor(props: PropsWithChildren<void>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState(() => ({
      hasError: true,
      error,
      errorInfo,
    }));
    console.error({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className={'container mx-auto p-16'}>
          <h1 className={'h1'}>Something went wrong.</h1>
          {this.state.error && (
            <>
              <h2 className={'h2'}>Error</h2>
              <h3 className={'h5'}>Name</h3>
              <pre className={'p-4 my-2 bg-gray-200 overflow-auto'}>
                {JSON.stringify(this.state.error.name, undefined, 4)}
              </pre>
              <h3 className={'h5'}>Message</h3>
              <pre className={'p-4 my-2 bg-gray-200 overflow-auto'}>
                {JSON.stringify(this.state.error.message, undefined, 4)}
              </pre>
              {this.state.error.stack && (
                <>
                  <h3 className={'h5'}>Stack</h3>
                  <Stack stack={this.state.error.stack} />
                </>
              )}
            </>
          )}
          {this.state.errorInfo && (
            <>
              <h2 className={'h2'}>ErrorInfo</h2>
              <h3 className={'h5'}>Component stack</h3>
              <Stack
                stack={this.state.errorInfo.componentStack?.replaceAll('\\n', '\n') ?? ''}
              />
            </>
          )}
        </main>
      );
    }
    return this.props.children;
  }
}

const Stack = ({ stack }: { stack: string }) => {
  const processedStack = useMemo(
    () =>
      stack
        .split('\n')
        .map((item) => {
          const match = item.split('@');
          if (match.length > 1)
            return {
              name: match[0],
              path: match.slice(1).join('@'),
            };
          return match[0] ?? null;
        })
        .filter((s): s is string | { name: string; path: string } => !!s),
    [stack],
  );

  return (
    <ol className={'p-4 my-2 bg-gray-200 overflow-auto'}>
      {processedStack.map((item, index) => (
        <li
          className={'flex gap-1 items-center whitespace-nowrap font-semibold'}
          key={index}
        >
          <span className={'text-xs text-gray-300'}>{index + 1}.</span>
          {typeof item === 'string' ? (
            <span className={'text-xs font-semibold'}>{item}</span>
          ) : (
            <a
              className={
                'link text-blue-500 flex gap-2 items-center truncate overflow-hidden w-full justify-between'
              }
              href={item.path}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <span>{item.name}</span>
              <span
                className={'text-gray-400 font-normal text-xs truncate overflow-hidden'}
              >
                {item.path.replaceAll(window.location.origin, '')}
              </span>
            </a>
          )}
        </li>
      ))}
    </ol>
  );
};
