import { Token, Providers } from './types';
export interface IResolver {
  resolve<T>(token: Token<T>, ...providers: Providers[]): T;
}
