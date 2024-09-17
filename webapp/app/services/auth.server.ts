import { createHash, hash, randomBytes } from 'node:crypto';

import { eq, InferSelectModel } from 'drizzle-orm';
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import invariant from 'tiny-invariant';

import { usersTable } from '@/db';
import getDBConnection from '@/db/connection';
import { sessionStorage } from '@/services/session.server';

export type UserType = Pick<
  InferSelectModel<typeof usersTable>,
  'email' | 'organizationId' | 'createdAt' | 'name' | 'profileUrl' | 'userId'
>;

export const authenticator = new Authenticator<UserType>(sessionStorage);

// authenticator.use(
//   new FormStrategy(async ({ form, context }) => {
//     const name = form.get('name');
//     const email = form.get('email');
//     const password = form.get('password');
//
//     invariant(!name || typeof name === 'string', 'name must be a string');
//
//     // You can validate the inputs however you want
//     invariant(typeof email === 'string', 'email must be a string');
//     invariant(email.length > 0, 'email must not be empty');
//
//     invariant(typeof password === 'string', 'password must be a string');
//     invariant(password.length > 0, 'password must not be empty');
//
//     const salt = randomBytes(16);
//
//     // And if you have a password you should hash it
//     const hashedPassword = hash('sha512', Buffer.concat([salt, Buffer.from(password)]));
//
//     // And finally, you can find, or create, the user
//
//     const connection = await getDBConnection;
//
//     connection.insert(usersTable).values({
//       name: name ?? email,
//       email,
//       password: hashedPassword,
//       salt: salt.toString('utf-8'),
//     });
//
//     const user = (
//       await connection
//         .select({
//           email: usersTable.email,
//           organizationId: usersTable.organizationId,
//           createdAt: usersTable.createdAt,
//           name: usersTable.name,
//           profileUrl: usersTable.profileUrl,
//           userId: usersTable.userId,
//         })
//         .from(usersTable)
//         .where(eq(usersTable.email, email))
//         .limit(1)
//     )?.[0];
//
//     invariant(!!user, `Could not get user with email ${email}.`);
//
//     // And return the user as the Authenticator expects it
//     return user;
//   }),
// );

const validatePassword = (
  actualPasswordHash: string,
  salt: string,
  testPassword: string,
) => {
  const testPasswordHash = createHash('sha256')
    .update(salt)
    .update(testPassword)
    .digest('hex');
  return actualPasswordHash === testPasswordHash;
};

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    invariant(typeof email === 'string', 'email must be a string');
    invariant(email.length > 0, 'email must not be empty');
    invariant(typeof password === 'string', 'password must be a string');
    invariant(password.length > 0, 'password must not be empty');

    const connection = await getDBConnection;

    const user = (
      await connection
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
    )?.[0];

    invariant(!!user, `User with email '${email}' not found.`);
    invariant(validatePassword(user.password, user.salt, password), `Invalid password.`);

    const { salt: _1, password: _2, ...returnedUser } = user;
    return returnedUser;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass',
);
