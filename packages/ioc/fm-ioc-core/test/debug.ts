import { AutoWired, Injectable, Singleton } from '../src';

export class SimppleAutoWried {
  constructor() {}

  hshs: string;

  @AutoWired
  dateProperty: Date;
}

@Singleton
// @Injectable
export class RoomService {
  constructor() {}
  @AutoWired
  current: Date;
}

@Injectable()
export class ClassRoom {
  constructor(public service: RoomService) {}
}
