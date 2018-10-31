import mocha from 'mocha';
import { expect } from 'chai';
import { IContainer, DefaultContainerBuilder } from '@ferrymen/fm-ioc-core';
import { LogModule } from '../src';

describe('logging test', () => {
  let container: IContainer;

  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();
    container = builder.create();
    await container.use(LogModule);
  });

  it('Aop lot test', () => {
    expect(LogModule).not.null;
  });
});
