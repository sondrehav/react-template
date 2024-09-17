const target = import.meta.env.VITE_INGEST_TARGET;

const errorLog = (tagId: string) => {
  const error = console.error;
  window.console.error = (...args: Parameters<typeof console.error>) => {
    fetch(`${target}/${tagId}/error`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    error(...args);
  };
};

const observeUrlChange = (tagId: string) => {
  let oldHref = document.location.href;
  const body = document.body;
  const observer = new MutationObserver(() => {
    if (oldHref !== document.location.href) {
      fetch(`${target}/${tagId}/pageView`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: oldHref,
          to: document.location.href,
        }),
      });
      oldHref = document.location.href;
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

const load = (tagId: string) => {
  fetch(`${target}/${tagId}/load`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const initialize = (tagId: string) => {
  load(tagId);
  errorLog(tagId);
  observeUrlChange(tagId);
};

(window as any).initializeIngest = initialize;
