import { DIModule, OnModuleStart } from '../src';
import {
  ContainerToken,
  Inject,
  IContainer,
  Injectable,
} from '@ferrymen/fm-ioc-core';
import { Aspect, Joinpoint, Around, AopModule } from '@ferrymen/fm-aop';

export class TestService {
  testFiled = 'test';
  test() {
    console.log('this is test');
  }
}

@DIModule({
  imports: [TestService],
  exports: [TestService],
})
export class ModuleCustom {}

@DIModule({
  imports: [ModuleCustom],
  providers: [{ provide: 'mark', useFactory: () => 'marked' }],
  exports: [ModuleCustom],
})
export class ModuleA {}

@Injectable
export class ClassSevice {
  @Inject('mark')
  mark: string;
  state: string;
  start() {
    console.log(this.mark);
  }
}

@Aspect
export class Logger {
  @Around('execution(*.start)')
  log(jp: Joinpoint) {
    console.log(jp.fullName, jp.state, 'start........');
  }

  @Around('execution(*.test)')
  logTest() {
    console.log('test........');
  }
}
@DIModule({
  imports: [AopModule, Logger, ModuleA],
  exports: [ClassSevice],
  bootstrap: ClassSevice,
})
export class ModuleB implements OnModuleStart<ClassSevice> {
  constructor(
    test: TestService,
    @Inject(ContainerToken) private container: IContainer
  ) {
    // let pools = container.get(ContainerPoolToken);
    // console.log(pools);
    // console.log('container pools defaults..................\n');
    // console.log(pools.getDefault());
    // console.log(container.resolveChain.toArray()[1]);
    // console.log(container.resolve(TestService));
    console.log(test);
    test.test();

    // console.log('container pools..................\n');
    // console.log(container);
  }
  mdOnStart(instance: ClassSevice): void | Promise<any> {
    console.log('mdOnStart...');
    // console.log(this.container);
    instance.start();
    instance.state = 'started';
  }
}
