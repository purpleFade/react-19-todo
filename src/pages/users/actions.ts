import { createUser, deleteUser } from '../../shared/api';

type CreateActionState = {
  // defaultEmail: string;
  error?: string;
};

/**
 * Creates a user action that handles the creation of a new user.
 *
 * @param {Object} params - The parameters for the action.
 * @param {Function} params.refetchUsers - A function to refetch the list of users.
 * @param {Function} params.setEmail - A function to set the email state.
 * @returns {Function} An asynchronous function that takes the previous state and form data,
 * and returns a new state after attempting to create a user.
 *
 * @typedef {Object} CreateActionState - The state object for the create action.
 * @property {string} [defaultEmail] - The default email value.
 * @property {string} [error] - The error message if the user creation fails.
 *
 * @param {CreateActionState} prevState - The previous state of the create action.
 * @param {Object} formData - The form data containing the email.
 * @param {string} formData.email - The email of the user to be created.
 * @returns {Promise<CreateActionState>} A promise that resolves to the new state.
 */

export function createUserAction({
  refetchUsers, setEmail,
}: {
  refetchUsers: () => void;
  setEmail: (email: string) => void;
}) {
  return async (
    prevState: CreateActionState,
    formData: { email: string; }
  ): Promise<CreateActionState> => {
    try {
      await createUser({
        email: formData.email,
        id: crypto.randomUUID(),
      });

      // Stale while revalidate
      refetchUsers();
      setEmail('');

      return {
        // defaultEmail: '',
      };
    } catch (error) {
      return {
        // defaultEmail: formData.email,
        error: (error as Error).message + ' Error while creating user!',
      };
    }
  };
}

type DeleteUserActionState = {
  error?: string;
};

/**
 * Deletes a user by their ID and refetches the user list.
 *
 * @param {Object} params - The parameters for the action.
 * @param {string} params.id - The ID of the user to delete.
 * @param {() => void} params.refetchUsers - A function to refetch the user list after deletion.
 * @returns {Promise<DeleteUserActionState>} A promise that resolves to the state of the delete user action.
 */

export function deleteUserAction({ id, refetchUsers }: { refetchUsers: () => void; id: string; }) {
  return async (): Promise<DeleteUserActionState> => {
    try {
      await deleteUser(id);
      refetchUsers();

      return {};
    } catch {
      return {};
    }
  };
}
