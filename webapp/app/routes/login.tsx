import { createHash, randomBytes } from 'node:crypto';

import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { motion } from 'framer-motion';
import { AuthorizationError } from 'remix-auth';

import { fadeFromLeftAnimation } from '@/animations';
import { authenticator } from '@/services/auth.server';

export default function LoginPage() {
  return (
    <motion.main
      className={'max-w-sm py-8 mx-auto'}
      initial={'hidden'}
      animate={'visible'}
      exit={'hidden'}
      variants={fadeFromLeftAnimation}
    >
      <h1>Hallo på do!</h1>
      <Form method={'post'} className={'flex flex-col gap-1'}>
        <label className={'text-sm font-semibold'}>Email</label>
        <input
          className={
            'px-6 py-3 rounded-lg border-primary-600 border-2 bg-white transition-colors focus:border-primary'
          }
          type={'email'}
          name={'email'}
          required
        />
        <label className={'text-sm font-semibold mt-4'}>Passord</label>
        <input
          className={
            'px-6 py-3 rounded-lg border-primary-600 border-2 bg-white transition-colors focus:border-primary'
          }
          type={'password'}
          name={'password'}
          autoComplete={'current-password'}
          required
        />
        <button
          className={
            'mt-4 max-w-fit overflow-hidden text-lg px-6 py-3 rounded-full bg-primary-600 text-primary-light transition-colors focus:bg-primary'
          }
        >
          Sign in
        </button>
      </Form>
    </motion.main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const res = await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      failureRedirect: '/login',
      throwOnError: true,
    });
    return res;
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      // here the error is related to the authentication process
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
}
