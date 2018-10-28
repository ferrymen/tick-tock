import 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  AutoWired,
  Injectable,
  Inject,
  Singleton,
} from '../src';
import { SimppleAutoWried, ClassRoom } from './debug';
// import * as debugModule from './debug';

describe('custom register test', () => {
  let container: IContainer;

  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();
    container = await builder.build();
  });

  it('decorator toString is decorator name', () => {
    expect(AutoWired.toString()).eq('@AutoWired');
    expect(Injectable.toString()).eq('@Injectable');
    expect(Singleton.toString()).eq('@Singleton');
  });

  it('should auto wried property', () => {
    container.register(SimppleAutoWried);

    let instance = container.get(SimppleAutoWried);
    expect(instance).not.undefined;
    expect(instance.dateProperty).not.undefined;
    expect(instance.dateProperty).instanceof(Date);
  });

  it('should auto create constructor params', () => {
    container.register(ClassRoom);
    let instance = container.get(ClassRoom);
    // console.log(instance);
    expect(instance).not.undefined;
    expect(instance.service).not.undefined;
    expect(instance.service.current).instanceOf(Date);
  });
});
