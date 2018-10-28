import {
  AutoWired,
  Injectable,
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
} from '../src';

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

export abstract class Student {
  @Inject(ContainerToken)
  container: IContainer;
  @Inject(Date)
  join: any;
  constructor() {}
  abstract sayHi(): string;
}

@Injectable({ provide: Student })
export class MiddleSchoolStudent extends Student {
  constructor() {
    super();
  }

  sayHi() {
    return 'I am a middle school student';
  }
}

@Injectable
export class InjMClassRoom {
  // @Inject(MiddleSchoolStudent)
  @Inject
  // @Inject({ type: MiddleSchoolStudent })
  leader: Student;
  constructor() {}
}
