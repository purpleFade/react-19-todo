import { useState, startTransition } from 'react';
import { fetchUsers } from '../../shared/api';

// Render as you fetch pattern
const defaultUsersPromise = fetchUsers();

export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () => {
    startTransition(() => {
      setUsersPromise(fetchUsers());
    });
  };

  return [usersPromise, refetchUsers] as const;
}
