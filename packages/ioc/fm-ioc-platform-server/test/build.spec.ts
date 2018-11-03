import 'mocha';
import { expect } from 'chai';
import { IContainer } from '@ferrymen/fm-ioc-core';

import { ContainerBuilder } from '../src';
import { SimppleAutoWried, ClassRoom } from './debug';

describe('auto register with build', () => {
  let container: IContainer;
  before(async () => {
    let builder = new ContainerBuilder();
    container = await builder.build({
      files: __dirname + '/debug.ts',
    });
    // container.register(IocLog);
  });

  it('should auto wried property', () => {
    let instance = container.get(SimppleAutoWried);
    expect(instance).not.undefined;
    expect(instance.dateProperty).not.undefined;
    expect(instance.dateProperty).instanceOf(Date);
  });

  it('should auto create constructor params', () => {
    let instance = container.get(ClassRoom);
    // console.log(instance);
    expect(instance).not.undefined;
    expect(instance.service).not.undefined;
    expect(instance.service.current).instanceOf(Date);
  });
});
