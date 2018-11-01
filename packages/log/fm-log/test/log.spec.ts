import mocha from 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  Injectable,
  Method,
  Inject,
} from '@ferrymen/fm-ioc-core';
import { LogModule } from '../src';
import { DebugLogAspect } from './DebugLogAspect';

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
}

describe('logging test', () => {
  let container: IContainer;

  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();
    container = builder.create();
    await container.use(LogModule);
  });

  it('Aop log test', () => {
    container.register(DebugLogAspect);
    container.register(MethodTest3);
    expect(container.syncInvoke('Test3', 'sayHello')).eq('Mama, I love you.');
  });
});
