import { createContext, useContext } from 'react';

export const HasAuth = createContext([
  false as boolean,
  (hasAuth: boolean) => {},
] as const);
export function useAuth() {
  return useContext(HasAuth);
}
