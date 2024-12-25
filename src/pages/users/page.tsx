import {
  startTransition,
  Suspense,
  use,
  useActionState,
  useState,
} from 'react';
import { fetchUsers } from '../../shared/api';
import { User } from '../../shared/types';
import { ErrorBoundary } from 'react-error-boundary';
import { createUserAction, deleteUserAction } from './actions';

// Render as you fetch pattern
const defaultUsersPromise = fetchUsers();

export function UsersPage() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => {
    startTransition(() => {
      setUsersPromise(fetchUsers());
    });
  };

  return (
    <main className='container max-auto p-4 pt-10 flex flex-col gap-4'>
      <h1 className='text-3xl font-bold uderline'>Users</h1>

      <CreateUserForm refetchUsers={refetchUsers} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className='text-red-500'>
            Something went wrong: {JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<h1>Loading...</h1>}>
          <UsersList usersPromise={usersPromise} refetchUsers={refetchUsers} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [email, setEmail] = useState('');
  const [state, dispatch, isPending] = useActionState(
    createUserAction({ refetchUsers, setEmail }),
    {},
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      dispatch({ email });
    });
  };

  return (
    <form className='flex gap-2' onSubmit={handleSubmit}>
      <input
        type='email'
        name='email'
        value={email}
        disabled={isPending}
        onChange={(e) => setEmail(e.target.value)}
        className='border p-2 rounded'
      />

      <button
        className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400'
        disabled={isPending}
        type='submit'
      >
        Add
      </button>
      {state.error && <div className='text-red-500'>{state.error}</div>}
    </form>
  );
}

export function UsersList({
  usersPromise,
  refetchUsers,
}: {
  usersPromise: Promise<User[]>;
  refetchUsers: () => void;
}) {
  const users = use(usersPromise);

  return (
    <div className='flex flex-col'>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  refetchUsers,
}: {
  user: User;
  refetchUsers: () => void;
}) {
  const [state, handleDelete, isPending] = useActionState(
    deleteUserAction({
      id: user.id,
      refetchUsers,
    }),
    {},
  );

  return (
    <div
      className='border p-2 m-2 rounded bg-gray-100 flex justify-between items-center'
      key={user.id}
    >
      {user.email}

      <form action={handleDelete}>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-400'
          disabled={isPending}
        >
          Delete
        </button>

        {state.error && <div className='text-red-500'>{state.error}</div>}
      </form>
    </div>
  );
}
