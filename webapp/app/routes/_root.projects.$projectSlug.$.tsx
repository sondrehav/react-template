import { useParams } from '@remix-run/react';
import React from 'react';
import invariant from 'tiny-invariant';

export default function Project() {
  const slug = useParams<{ projectSlug: string }>().projectSlug;
  invariant(slug, "'projectSlug' was not defined.");

  return (
    <div className={'flex flex-col gap-4 w-full'}>
      <h1>{slug}</h1>
    </div>
  );
}
