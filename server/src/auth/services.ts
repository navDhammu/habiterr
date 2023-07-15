import { createUser, getUserByEmail } from './queries';
import bcrypt from 'bcrypt';
import { createError } from '@fastify/error';

type Credentials = {
   email: string;
   password: string;
};

export async function signup(userDetails: Credentials) {
   const user = await getUserByEmail(userDetails.email);
   if (user) {
      const CustomError = createError(
         'USER_ALREADY_EXISTS',
         'User already exists',
         409
      );
      throw new CustomError();
   }
   const passwordHash = await bcrypt.hash(userDetails.email, 10);
   return createUser({ email: userDetails.email, password: passwordHash });
}

export async function login({ email, password }: Credentials) {
   const user = await getUserByEmail(email);
   if (!user || !(await bcrypt.compare(password, user.password))) {
      const LoginError = createError(
         'INVALID_CREDENTIALS',
         'Invalid email and/or password combination',
         401
      );
      throw new LoginError();
   }

   return { email: user.email, name: user.name, id: user.id };
}