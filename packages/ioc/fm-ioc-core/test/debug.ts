import { AutoWired } from '../src';

export class SimppleAutoWried {
  constructor() {}

  @AutoWired
  dateProperty: Date;
}
