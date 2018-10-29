import 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  Injectable,
} from '@ferrymen/fm-ioc-core';
import { AopModule } from '../src';

describe('aop test', () => {
  @Injectable('Test3')
  class MethodTest3 {
    constructor() {}

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
  });

  it('Aop annotation test', () => {
    container.register(MethodTest3);
    expect(container.syncInvoke('Test3', 'sayHello3')).eq('Hello 3');
  });
});
