import { User } from './types';

const API = 'http://localhost:3001';

export function fetchUsers(): Promise<User[]> {
  return fetch(`${API}/users`).then((res) => res.json());
}

export function createUser(user: User) {
  return fetch(`${API}/users`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((res) => res.json());
}

export function deleteUser(id: string) {
  return fetch(`${API}/users/${id}`, {
    method: 'DELETE',
  }).then((res) => res.json());
}
