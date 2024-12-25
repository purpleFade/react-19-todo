import { User } from '../../../shared/types';
import { DeleteUserAction } from '../actions';
import { UserCard } from './UserCard';

export function UsersList({
  useUsersList,
  deleteUserAction,
}: {
  useUsersList: () => User[];
  deleteUserAction: DeleteUserAction;
}) {
  const users = useUsersList();

  return (
    <div className='flex flex-col gap-4'>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </div>
  );
}
