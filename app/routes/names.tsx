import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { v4 } from 'uuid';

import {
  cardAnimation,
  containerWithStaggeredChildrenAnimation,
  expandAnimation,
  fadeFromLeftAnimation,
} from '@/animations';
import Button from '@/components/core/Button';
import Input from '@/components/core/Input';
import CrossSm from '@/components/icons/Close.svg';
import { queryClient } from '@/root';

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
