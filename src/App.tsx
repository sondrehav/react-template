import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';

import CrossSm from '@/components/icons/Close.svg';
import { queryClient } from '@/main';

type PostNameApiRequestBody = { name: string };
type PostNameApiResponseBody = { name: string; id: string };
type GetNamesApiResponseBody = Array<{ name: string; id: string }>;

const cardAnimation = {
  hidden: { opacity: 0, left: -20 } satisfies Transition,
  exit: { opacity: 0, left: 20, rotate: [0, -4, 0] } satisfies Transition,
  visible: {
    rotate: [0, -4, 0],
    opacity: 1,
    left: 0,
  } satisfies Transition,
};

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<PostNameApiRequestBody>({
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();
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
      <div className={'flex flex-col gap-1 mb-4'}>
        <label htmlFor={'name-input'}>Name</label>
        <input
          {...register('name', { required: true })}
          placeholder={'Name...'}
          id={'name-input'}
          data-testid={'name-input'}
          className={classNames(
            'rounded-xl bg-white px-6 py-3 text-base placeholder:text-gray-400 transition-all border-white border-4 hover:border-gray-300 focus:border-primary-dark',
            { 'border-alert': !isValid && isDirty },
          )}
        />
      </div>
      <button
        data-testid={'name-form-submit'}
        type={'submit'}
        disabled={isPending}
        className={
          'rounded-full bg-primary-dark text-primary-light max-w-min px-5 py-3 text-base font-semibold transition-colors focus:bg-primary-dark hover:bg-primary-dark action:bg-primary-light disabled:bg-gray-200'
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
            variants={containerAnimation}
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
            className={'relative text-primary-500 italic'}
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
        'relative py-2 mb-1 bg-white rounded p-4 origin-top-right flex items-center gap-2'
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

const Col = ({ className }: { className?: string }) => {
  return <div className={classNames('rounded-lg size-8', className)}></div>;
};

const ColorGrid = () => {
  return (
    <div className={'grid grid-cols-3 mx-auto gap-4'}>
      <Col className={'bg-primary-50'} />
      <Col className={'bg-secondary-50'} />
      <Col className={'bg-gray-50'} />
      <Col className={'bg-primary-100'} />
      <Col className={'bg-secondary-100'} />
      <Col className={'bg-gray-100'} />
      <Col className={'bg-primary-200'} />
      <Col className={'bg-secondary-200'} />
      <Col className={'bg-gray-200'} />
      <Col className={'bg-primary-300'} />
      <Col className={'bg-secondary-300'} />
      <Col className={'bg-gray-300'} />
      <Col className={'bg-primary-400'} />
      <Col className={'bg-secondary-400'} />
      <Col className={'bg-gray-400'} />
      <Col className={'bg-primary-500'} />
      <Col className={'bg-secondary-500'} />
      <Col className={'bg-gray-500'} />
      <Col className={'bg-primary-600'} />
      <Col className={'bg-secondary-600'} />
      <Col className={'bg-gray-600'} />
      <Col className={'bg-primary-700'} />
      <Col className={'bg-secondary-700'} />
      <Col className={'bg-gray-700'} />
      <Col className={'bg-primary-800'} />
      <Col className={'bg-secondary-800'} />
      <Col className={'bg-gray-800'} />
      <Col className={'bg-primary-900'} />
      <Col className={'bg-secondary-900'} />
      <Col className={'bg-gray-900'} />
      <Col className={'bg-primary-950'} />
      <Col className={'bg-secondary-950'} />
      <Col className={'bg-gray-950'} />
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
        <ColorGrid />
        <h1>Hello, World!</h1>
        <NameForm />
        <NamesList />
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
