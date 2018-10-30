import 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  Injectable,
  Inject,
  Method,
} from '@ferrymen/fm-ioc-core';
import { AopModule } from '../src';
import { IocLog } from './IocLog';

describe('aop test', () => {
  @Injectable
  class Person {
    constructor() {}
    say() {
      return 'I love you.';
    }
  }

  @Injectable
  class Child extends Person {
    constructor() {
      super();
    }
    say() {
      return 'Mama';
    }
  }

  @Injectable('Test3')
  class MethodTest3 {
    constructor() {}

    @Method
    sayHello(@Inject(Child) personA: Person, personB: Person) {
      return personA.say() + ', ' + personB.say();
    }

    sayHello2() {}
    sayHello3() {
      return 'Hello 3';
    }
  }
  let container: IContainer;
  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();

    container = await builder.create();
    container.use(AopModule);
    container.register(IocLog);
  });

  it('Aop annotation test', () => {
    container.register(MethodTest3);
    expect(container.syncInvoke('Test3', 'sayHello3')).eq('Hello 3');
    expect(container.syncInvoke('Test3', 'sayHello')).eq('Mama, I love you.');
  });
});
