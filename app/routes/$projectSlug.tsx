import { DefaultError, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useParams } from 'react-router-dom';

import { fadeFromLeftAnimation } from '@/animations';
import Input from '@/components/core/Input';

const Title = () => {
  const slug = 'nasnas';
  return (
    <div className={'flex flex-col gap-1'}>
      <h1 className={'mt-0'}>{slug}</h1>
    </div>
  );
};

type GetProjectDetailsApiResponseBody = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

function ProjectPage({ projectSlug }: { projectSlug: string }) {
  const { isLoading, error, data } = useQuery<
    unknown,
    DefaultError & { id: string },
    GetProjectDetailsApiResponseBody
  >({
    enabled: !!projectSlug,
    queryKey: [`projects/${projectSlug}`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: '628546f8-3765-42e6-90c7-b09856e7b6bb',
        slug: projectSlug,
        name: projectSlug,
        logoUrl: null,
      };
    },
  });
  return (
    <motion.main
      className={'py-6 pr-6 relative w-full h-full '}
      initial={'hidden'}
      animate={!data ? 'hidden' : 'visible'}
      exit={'hidden'}
      variants={fadeFromLeftAnimation}
      key={projectSlug}
    >
      <div className={'bg-gray-50 rounded-xl h-full shadow-subtle p-12 component-grid'}>
        <div className={'col-span-3'}>
          <h1 className={'mt-0'}>{data?.name}</h1>
        </div>
        <div className={'col-span-2'}>
          <h2 className={'h4'}>Visitors</h2>
          <Input className={'max-w-sm'} placeholder={'Banan'} label={'Banan'} />
        </div>
        <div>
          <h2 className={'h4'}>Geographic distribution</h2>
        </div>
        <div>
          <h2 className={'h4'}>Pages</h2>
        </div>
        <div>
          <h2 className={'h4'}>Referrals</h2>
        </div>
        <div>
          <h2 className={'h4'}>Devices</h2>
        </div>
        {/*<div className={'max-w-sm'}>*/}
        {/*  <h1 className={'mt-0'}>{slug}</h1>*/}
        {/*  <NameForm />*/}
        {/*  <NamesList />*/}
        {/*</div>*/}
      </div>
    </motion.main>
  );
}

export default function Project() {
  const projectSlug = useParams<{ projectSlug: string }>().projectSlug;
  if (!projectSlug) {
    return null;
  }
  return (
    <AnimatePresence mode={'wait'}>
      <ProjectPage key={projectSlug} projectSlug={projectSlug} />;
    </AnimatePresence>
  );
}
