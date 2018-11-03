import {
  AutoWired,
  Injectable,
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
  Param,
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

@Injectable({ provide: Student })
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

@Injectable({ provide: Student, alias: 'college' })
export class CollegeStudent extends Student {
  constructor() {
    super();
  }
  sayHi() {
    return 'I am a college student';
  }
}

@Injectable
export class CollegeClassRoom {
  constructor(
    @Param(CollegeStudent)
    @AutoWired(CollegeStudent)
    public leader: Student
  ) {}
}

@Injectable
export class InjMClassRoom {
  // @Inject(MiddleSchoolStudent)
  @Inject
  // @Inject({ type: MiddleSchoolStudent })
  leader: Student;
  constructor() {}
}

@Injectable
export class InjCollegeClassRoom {
  constructor(
    // all below decorator can work, also @AutoWired, @Param is.
    // @Inject(new Registration(Student, 'college')) // need CollegeStudent also register.

    // @Inject({ provider: CollegeStudent })
    // @Inject({ provider: Student, alias: 'college' }) //need CollegeStudent also register.
    // @Inject({ type: CollegeStudent })
    @Inject(CollegeStudent) public leader: Student
  ) {}
}

@Injectable('StringClassRoom')
export class StingMClassRoom {
  // @Inject(MiddleSchoolStudent)
  @Inject
  // @Inject({ type: MiddleSchoolStudent })
  leader: Student;
  constructor() {}
}

export interface IClassRoom {
  leader: Student;
}

export class StringIdTest {
  constructor(@Inject('StringClassRoom') public room: IClassRoom) {}
}

export const CollClassRoom = Symbol('CollegeClassRoom');

export class SymbolIdest {
  @Inject(CollClassRoom)
  public room: IClassRoom;

  @Inject(ContainerToken)
  public container: IContainer;
  constructor(@Inject('StringClassRoom') public room2: IClassRoom) {}
}
