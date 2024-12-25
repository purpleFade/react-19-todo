import { useActionState } from 'react';
import { User } from '../../../shared/types';
import { DeleteUserAction } from '../actions';

export function UserCard({
  user,
  deleteUserAction,
}: {
  user: User;
  deleteUserAction: DeleteUserAction;
}) {
  const [state, handleDelete] = useActionState(deleteUserAction, {});

  return (
    <div
      className='border p-2 rounded bg-gray-100 flex justify-between items-center'
      key={user.id}
    >
      {user.email}

      <form action={handleDelete}>
        <input type='hidden' name='id' value={user.id} />
        <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-color'>
          Delete
        </button>

        {state.error && <div className='text-red-500'>{state.error}</div>}
      </form>
    </div>
  );
}
