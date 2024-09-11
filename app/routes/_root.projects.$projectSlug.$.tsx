import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import React from 'react';
import invariant from 'tiny-invariant';

import { projectIdBySlug, projects } from '../../data';

const hasProject = (
  params: LoaderFunctionArgs['params'],
): params is { projectSlug: keyof typeof projectIdBySlug } =>
  typeof params.projectSlug === 'string' && params.projectSlug in projectIdBySlug;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!hasProject(params))
    throw json(`Project with slug '${params.projectSlug}' not found`, {
      status: 404,
    });

  return json({
    project: projects[projectIdBySlug[params.projectSlug]],
  });
};

export default function Project() {
  const slug = useParams<{ projectSlug: string }>().projectSlug;
  invariant(slug, "'projectSlug' was not defined.");

  return (
    <div className={'flex flex-col gap-4 w-full'}>
      <h1>{slug}</h1>
    </div>
  );
}
