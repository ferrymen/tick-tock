import { AutoWired, Injectable, Singleton } from '@ferrymen/fm-ioc-core';

export class SimppleAutoWried {
  constructor() {}

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
