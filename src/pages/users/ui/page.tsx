import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useUsers } from '../hooks/useUsers';
import { CreateUserForm } from '../components/CreateUserForm';
import { UsersList } from '../components/UsersList';

export function UsersPage() {
  const { createUserAction, deleteUserAction, useUsersList } = useUsers();

  return (
    <main className='container max-auto p-4 pt-10 flex flex-col gap-4'>
      <h1 className='text-3xl font-bold'>Users</h1>

      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className='text-red-500'>
            Something went wrong: {JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<h1>Loading...</h1>}>
          <UsersList
            useUsersList={useUsersList}
            deleteUserAction={deleteUserAction}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
