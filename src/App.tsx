import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { v4 } from 'uuid';

import {
  cardAnimation,
  containerWithStaggeredChildrenAnimation,
  expandAnimation,
  fadeFromLeftAnimation,
} from '@/animations';
import Button from '@/components/core/Button';
import Input from '@/components/core/Input';
import BugSm from '@/components/icons/Bug.svg';
import CircleSm from '@/components/icons/Circle.svg';
import CrossSm from '@/components/icons/Close.svg';
import EditSm from '@/components/icons/Edit.svg';
import { queryClient } from '@/main';

type PostNameApiRequestBody = { name: string };
type PostNameApiResponseBody = { name: string; id: string };
type GetNamesApiResponseBody = Array<{ name: string; id: string }>;

const NameForm = () => {
  const { handleSubmit, reset, control } = useForm<PostNameApiRequestBody>({
    defaultValues: {
      name: '',
    },
  });

  const { isPending, error, mutate } = useMutation<
    PostNameApiResponseBody,
    DefaultError & { id: string },
    PostNameApiRequestBody
  >({
    mutationKey: ['names'],
    // mutationFn: (body) =>
    //   fetch('/api/names', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       reset();
    //       return res;
    //     })
    //     .catch((e) => {
    //       throw { ...e, id: v4() };
    //     }),
    mutationFn: async (body) => {
      reset();
      await new Promise((resolve) => setTimeout(resolve, 10));
      return { ...body, id: v4() };
    },

    onSuccess: async (data) => {
      queryClient.setQueryData(['names'], (old: GetNamesApiResponseBody) => [
        ...old,
        data,
      ]);
    },
  });

  return (
    <form
      data-testid={'name-form'}
      onSubmit={handleSubmit(mutate)}
      className={'flex flex-col'}
    >
      <Controller<PostNameApiRequestBody, 'name'>
        control={control}
        name={'name'}
        rules={{ required: { value: true, message: 'Name is required' } }}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            autoComplete={false}
            placeholder={'Name...'}
            label={'Name'}
            id={'name-input'}
            data-testid={'name-input'}
            errorId={fieldState.error?.type}
            errorMessage={fieldState.error?.message}
            wrapperClassName={'mb-4'}
          />
        )}
      />
      <Button data-testid={'name-form-submit'} type={'submit'} disabled={isPending}>
        Submit
      </Button>
      <AnimatePresence>
        {error && (
          <motion.span
            key={error.id}
            className={'relative text-alert font-normal text-sm mt-2'}
            variants={expandAnimation}
            initial={'hidden'}
            exit={'hidden'}
            animate={'visible'}
            layout
          >
            Something went wrong!
          </motion.span>
        )}
      </AnimatePresence>
    </form>
  );
};

const NamesList = () => {
  // const { isLoading, error, data } = useQuery<
  //   GetNamesApiResponseBody,
  //   DefaultError & { id: string }
  // >({
  //   queryKey: ['names'],
  //   queryFn: () =>
  //     fetch('/api/names', {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     })
  //       .then((res) => res.json())
  //       .catch((e) => {
  //         throw { ...e, id: v4() };
  //       }),
  // });
  const { isLoading, error, data } = useQuery<
    GetNamesApiResponseBody,
    DefaultError & { id: string }
  >({
    queryKey: ['names'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        { id: 'a', name: 'Lisa' },
        { id: 'b', name: 'Per' },
        { id: 'c', name: 'Pål' },
        { id: 'd', name: 'Ida' },
        { id: 'e', name: 'Marie' },
      ];
    },
  });
  return (
    <motion.div className={'flex flex-col gap-2'} layout>
      <h2>List of names</h2>
      <AnimatePresence mode={'wait'}>
        {data && (
          <motion.ul
            key={'list'}
            data-testid={'names-list'}
            className={'relative flex flex-col'}
            initial={'hidden'}
            animate={'visible'}
            variants={containerWithStaggeredChildrenAnimation}
          >
            <AnimatePresence>
              {data.map((item) => (
                <NameListItem key={item.id} {...item} />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
        {isLoading && (
          <motion.span
            key={'pending-indicator'}
            className={'relative text-primary-dark italic'}
            variants={fadeFromLeftAnimation}
            initial={'hidden'}
            exit={'hidden'}
            animate={'visible'}
          >
            Loading...
          </motion.span>
        )}
        {error && (
          <motion.span
            key={error.id}
            className={'relative text-alert font-normal text-sm'}
            variants={expandAnimation}
            initial={'hidden'}
            exit={'hidden'}
            animate={'visible'}
            layout
          >
            Something went wrong!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NameListItem = ({ name, id }: { name: string; id: string }) => {
  const { isPending, mutate } = useMutation<
    void,
    DefaultError & { id: string },
    { id: string }
  >({
    mutationKey: ['names'],
    // mutationFn: (body) =>
    //   fetch('/api/names', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body),
    //   })
    //     .then((res) => res.json())
    //     .then((res) => {
    //       reset();
    //       return res;
    //     })
    //     .catch((e) => {
    //       throw { ...e, id: v4() };
    //     }),
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    },

    onSuccess: async (_, args) => {
      queryClient.setQueryData(['names'], (old: GetNamesApiResponseBody) =>
        old.filter((s) => s.id !== args.id),
      );
    },
  });

  return (
    <motion.li
      key={id}
      className={
        'relative py-2 mb-1 bg-gray-50 rounded p-4 origin-top-right flex items-center gap-2 shadow-subtle border-2 border-gray-400'
      }
      data-testid={'names-list-item'}
      variants={cardAnimation}
      layout
      exit={cardAnimation.exit}
    >
      <span className={'flex-1'}>{name}</span>
      <button
        className={
          'flex-grow-0 flex-shrink-0 transition-colors text-gray-400 focus:text-gray-500 hover:text-primary-dark'
        }
        disabled={isPending}
        onClick={() => mutate({ id })}
      >
        <CrossSm className={'size-6 fill-current'} />
      </button>
    </motion.li>
  );
};

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

type GetProjectDetailsApiResponseBody = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
};

const ProjectPage = () => {
  const slug = useParams<{ slug: string }>().slug;

  const { isLoading, error, data } = useQuery<
    unknown,
    DefaultError & { id: string },
    GetProjectDetailsApiResponseBody
  >({
    enabled: !!slug,
    queryKey: [`projects/${slug}`],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: '628546f8-3765-42e6-90c7-b09856e7b6bb',
        slug: 'coop',
        name: 'Coop gavekort',
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
};

const Inner = () => {
  const location = useLocation();
  const key = location.pathname.split('/')[1];
  return (
    <AnimatePresence mode={'wait'}>
      <Routes location={location} key={key}>
        <Route path={'/:slug'} element={<ProjectPage />}></Route>
        <Route path={'/'} element={':('}></Route>
      </Routes>
    </AnimatePresence>
  );
};

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
        <Inner />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
