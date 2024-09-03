import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';

import { queryClient } from '@/main';

type PostNameApiRequestBody = { name: string };
type PostNameApiResponseBody = { name: string; id: string };
type GetNamesApiResponseBody = Array<{ name: string; id: string }>;

const itemAnimation = {
  hidden: { opacity: 0, left: -10 } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
  } satisfies Transition,
};

const expandAnimation = {
  hidden: { opacity: 0, height: 0, left: -10 } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
    height: 'auto',
  } satisfies Transition,
};

const containerAnimation = {
  hidden: { opacity: 0, left: -10 } satisfies Transition,
  visible: {
    opacity: 1,
    left: 0,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.1,
    },
  } satisfies Transition,
};

const NameForm = () => {
  const { register, handleSubmit, reset } = useForm<PostNameApiRequestBody>({
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
    mutationFn: (body) =>
      fetch('/api/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          reset();
          return res;
        })
        .catch((e) => {
          throw { ...e, id: v4() };
        }),
    // mutationFn: async (body) => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   reset();
    //   return { ...body, id: v4() };
    // },

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
      <div className={'flex flex-col gap-1 mb-4'}>
        <label htmlFor={'name-input'}>Name</label>
        <input
          {...register('name')}
          placeholder={'Name...'}
          id={'name-input'}
          data-testid={'name-input'}
          className={
            'rounded-xl bg-white px-6 py-3 text-base placeholder:text-gray-400 transition-all border-white border-4 hover:border-gray-300 focus:border-primary'
          }
        />
      </div>
      <button
        data-testid={'name-form-submit'}
        type={'submit'}
        disabled={isPending}
        className={
          'rounded-full bg-primary text-primary-light max-w-min px-5 py-3 text-base font-semibold transition-colors hover:bg-secondary action:bg-secondary-light disabled:bg-gray-200'
        }
      >
        Submit
      </button>
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
  const { isLoading, error, data } = useQuery<
    GetNamesApiResponseBody,
    DefaultError & { id: string }
  >({
    queryKey: ['names'],
    queryFn: () =>
      fetch('/api/names', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .catch((e) => {
          throw { ...e, id: v4() };
        }),
  });
  // const { isLoading, error, data } = useQuery<GetNamesApiResponseBody>({
  //   queryKey: ['names'],
  //   queryFn: async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     return [
  //       { id: 'a', name: 'Lisa' },
  //       { id: 'b', name: 'Per' },
  //       { id: 'c', name: 'Pål' },
  //       { id: 'd', name: 'Ida' },
  //       { id: 'e', name: 'Marie' },
  //     ];
  //   },
  // });
  return (
    <div className={'flex flex-col gap-2'}>
      <h2>List of names</h2>
      <AnimatePresence mode={'wait'}>
        {data && (
          <motion.ul
            key={'list'}
            data-testid={'names-list'}
            className={'relative flex flex-col divide-y-2 divide-gray-200'}
            initial={'hidden'}
            animate={'visible'}
            variants={containerAnimation}
          >
            {data.map((item) => (
              <motion.li
                key={item.id}
                className={'relative py-2 mb-1'}
                data-testid={'names-list-item'}
                variants={itemAnimation}
              >
                {item.name}
              </motion.li>
            ))}
          </motion.ul>
        )}
        {isLoading && (
          <motion.span
            key={'pending-indicator'}
            className={'relative text-gray-400 italic'}
            variants={itemAnimation}
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
    </div>
  );
};

const App = () => {
  return (
    <AnimatePresence>
      <motion.div
        className={
          'flex flex-col h-full container mx-auto py-16 px-2 gap-8 max-w-sm relative'
        }
        initial={'hidden'}
        animate={'visible'}
        variants={containerAnimation}
      >
        <h1>Hello, World!</h1>
        <NameForm />
        <NamesList />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
