import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { queryClient } from '@/main';

type PostNameApiRequestBody = { name: string };
type PostNameApiResponseBody = { name: string; id: string };
type GetNamesApiResponseBody = Array<{ name: string; id: string }>;

const NameForm = () => {
  const { register, handleSubmit, reset } = useForm<PostNameApiRequestBody>({
    defaultValues: {
      name: '',
    },
  });

  const { isPending, error, mutate } = useMutation<
    PostNameApiResponseBody,
    DefaultError,
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
        }),
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
      className={'flex flex-col gap-4'}
    >
      <div className={'flex flex-col gap-1'}>
        <label htmlFor={'name-input'}>Name</label>
        <input
          {...register('name')}
          placeholder={'Name...'}
          id={'name-input'}
          data-testid={'name-input'}
          className={
            'rounded-xl bg-white px-6 py-3 text-base placeholder:text-gray-400 transition-all border-white border-4 hover:border-gray-300 focus:border-secondary-light'
          }
        />
      </div>
      <button
        data-testid={'name-form-submit'}
        type={'submit'}
        disabled={isPending}
        className={
          'rounded-full bg-primary text-primary-light max-w-min px-4 py-2 transition-colors hover:bg-secondary action:bg-secondary-light disabled:bg-gray-200 text-md'
        }
      >
        Submit
      </button>
      {error && (
        <span className={'text-alert font-normal text-sm'}>Something went wrong!</span>
      )}
    </form>
  );
};

const NamesList = () => {
  const { isLoading, error, data } = useQuery<GetNamesApiResponseBody>({
    queryKey: ['names'],
    queryFn: () =>
      fetch('/api/names', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json()),
  });

  return (
    <div className={'flex flex-col gap-2'}>
      <h2>List of names</h2>
      {data && (
        <motion.ul
          data-testid={'names-list'}
          className={'flex flex-col gap-1 divide-y-2 divide-gray-200'}
        >
          {data.map((item) => (
            <li key={item.id} className={'py-2'} data-testid={'names-list-item'}>
              {item.name}
            </li>
          ))}
        </motion.ul>
      )}
      {isLoading && <span className={'text-gray-400 italic'}>Loading...</span>}
      {error && (
        <span className={'text-alert font-normal text-sm'}>Something went wrong!</span>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className={'flex flex-col h-full container mx-auto py-16 px-2 gap-8 max-w-sm'}>
      <h1>Hello, World!</h1>
      <NameForm />
      <NamesList />
    </div>
  );
};

export default App;
