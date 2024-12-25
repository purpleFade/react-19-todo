import { useActionState, useOptimistic, useRef } from 'react';
import { CreateUserAction } from '../actions';

export function CreateUserForm({
  createUserAction,
}: {
  createUserAction: CreateUserAction;
}) {
  const [state, dispatch, isPending] = useActionState(createUserAction, {
    email: '',
  });

  const [optimisticState, setOptimisticState] = useOptimistic(state);
  const form = useRef<HTMLFormElement>(null);

  return (
    <form
      className='flex gap-2'
      ref={form}
      action={(formData: FormData) => {
        setOptimisticState({ email: '' });
        dispatch(formData);
        form?.current?.reset();
      }}
    >
      <input
        type='email'
        defaultValue={optimisticState.email}
        name='email'
        className='border p-2 rounded'
      />

      <button
        className='bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-color disabled:bg-gray-400'
        type='submit'
        disabled={isPending}
      >
        Add
      </button>
      {optimisticState.error && (
        <div className='text-red-500'>{optimisticState.error}</div>
      )}
    </form>
  );
}
