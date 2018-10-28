import {
  AutoWired,
  Injectable,
  Singleton,
  Inject,
  ContainerToken,
  IContainer,
  Param,
  Registration,
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

@Injectable()
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

@Injectable
export class InjCollegeAliasClassRoom {
  constructor(
    // all below decorator can work, also @AutoWired, @Param is.
    // @Inject(CollegeStudent)
    // @Inject({ provider: CollegeStudent })
    // @Inject({ provider: Student, alias: 'college' }) // need CollegeStudent also register.
    // @Inject({ type: CollegeStudent })
    @Inject(new Registration(Student, 'college')) // need CollegeStudent also register.
    public leader: Student
  ) {}
}
