import {
  AutoWired,
  Injectable,
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
} from '@ferrymen/fm-ioc-core';

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

export abstract class Student {
  @Inject(ContainerToken)
  container: IContainer;
  @Inject(Date)
  join: any;
  constructor() {}
  abstract sayHi(): string;
}

// @Injectable({ provide: Student })
// @Injectable()
// @Injectable
export class MiddleSchoolStudent extends Student {
  constructor() {
    super();
  }
  sayHi() {
    return 'I am a middle school student';
  }
}

// @Injectable()
export class MClassRoom {
  @AutoWired(MiddleSchoolStudent)
  leader: Student;
  constructor() {}
}
