import { useState, startTransition, useOptimistic, use } from 'react';
import { fetchUsers } from '../../../shared/api';
import { User } from '../../../shared/types';
import { createUserAction, deleteUserAction } from '../actions';

// Render as you fetch pattern
const defaultUsersPromise = fetchUsers();

export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () => {
    startTransition(() => {
      setUsersPromise(fetchUsers());
    });
  };

  // Optimistic updates
  const [createUsers, optimisticCreate] = useOptimistic(
    [] as User[],
    (createUsers, user: User) => [...createUsers, user],
  );

  const [deletedUsersIds, optimisticDelete] = useOptimistic(
    [] as string[],
    (deleteUsers, id: string) => deleteUsers.concat(id),
  );

  const useUsersList = () => {
    const users = use(usersPromise);

    return users
      .concat(createUsers)
      .filter((user) => !deletedUsersIds.includes(user.id));
  };

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList,
  } as const;
}
