import { Outlet } from '@remix-run/react';
import { DefaultError, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

import {
  cardAnimation,
  containerWithStaggeredChildrenAnimation,
  fadeFromLeftAnimation,
} from '@/animations';
import Input from '@/components/core/Input';
import BugSm from '@/components/icons/Bug.svg';
import EditSm from '@/components/icons/Edit.svg';

const NavLinkItem = ({
  to,
  name,
  logoUrl,
}: {
  to: string;
  name: string;
  logoUrl: string | null;
}) => (
  <motion.li className={'relative'} variants={cardAnimation}>
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          'relative py-2 mb-4 rounded p-4 origin-top-right flex items-center gap-2 transition-colors group hover:text-primary-dark focus:text-primary-dark',
          {
            'bg-gray-50 shadow-subtle text-primary-dark font-semibold': isActive,
            'text-gray-800': !isActive,
          },
        )
      }
    >
      <BugSm className={'size-6 fill-current'} />
      <span className={'flex-1 truncate overflow-hidden'}>{name}</span>
      <button
        className={
          'flex-grow-0 flex-shrink-0 transition-all text-primary-400 focus:text-gray-500 hover:text-primary-dark opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-focus:opacity-100 group-focus:pointer-events-auto'
        }
      >
        <EditSm className={'size-6 fill-current'} />
      </button>
    </NavLink>
  </motion.li>
);

const Title = () => {
  const slug = 'nasnas';
  return (
    <div className={'flex flex-col gap-1'}>
      <h1 className={'mt-0'}>{slug}</h1>
    </div>
  );
};

// const Inner = () => {
//   const location = useLocation();
//   const key = location.pathname.split('/')[1];
//   return (
//     <AnimatePresence mode={'wait'}>
//       <Routes location={location} key={key}>
//         <Route path={'/:slug'} element={<ProjectPage />}></Route>
//         <Route path={'/'} element={':('}></Route>
//       </Routes>
//     </AnimatePresence>
//   );
// };

type GetProjectListApiResponseBody = Array<{
  name: string;
  slug: string;
  id: string;
  logoUrl: string | null;
}>;

const ProjectList = () => {
  const { isLoading, error, data } = useQuery<
    GetProjectListApiResponseBody,
    DefaultError & { id: string },
    GetProjectListApiResponseBody
  >({
    queryKey: ['projects'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        {
          id: '628546f8-3765-42e6-90c7-b09856e7b6bb',
          slug: 'coop',
          name: 'Coop gavekort',
          logoUrl: null,
        },
        {
          id: '97651ef3-a2c5-416e-8a30-4a7a65b1459f',
          slug: 'tavler',
          name: 'Tavler Tavler Tavler Tavler',
          logoUrl: null,
        },
        {
          id: '58c8e8da-83d9-4529-9f0d-6dab361dfb54',
          slug: 'europris',
          name: 'Europris',
          logoUrl: null,
        },
        {
          id: 'b1ceb21a-1fe4-4373-963a-1ce714388bbe',
          slug: 'eplehuset',
          name: 'Eplehuset',
          logoUrl: null,
        },
        {
          id: 'df2cbd06-de31-4025-9fd5-b29787c4fee7',
          slug: 'goodtech',
          name: 'Goodtech',
          logoUrl: null,
        },
      ];
    },
  });

  return (
    <motion.ul
      className={'relative flex flex-col w-full'}
      animate={!data ? 'hidden' : 'visible'}
      initial={'hidden'}
      variants={containerWithStaggeredChildrenAnimation}
    >
      {data?.map(({ logoUrl, name, id, slug }) => (
        <NavLinkItem logoUrl={logoUrl} key={id} name={name} to={`/${slug}`} />
      ))}
    </motion.ul>
  );
};

const App = () => {
  return (
    <AnimatePresence>
      <motion.div
        className={'flex h-full'}
        initial={'hidden'}
        animate={'visible'}
        variants={fadeFromLeftAnimation}
      >
        <nav className={'flex h-full sidebar-nav overflow-hidden p-6'}>
          <ProjectList />
        </nav>
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
