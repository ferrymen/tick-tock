import 'mocha';
import { expect } from 'chai';
import {
  IContainer,
  DefaultContainerBuilder,
  AutoWired,
  Injectable,
} from '../src';
import { SimppleAutoWried } from './debug';
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
  });

  it('should auto wried property', () => {
    container.register(SimppleAutoWried);

    let instance = container.get(SimppleAutoWried);
    expect(instance).not.undefined;
    expect(instance.dateProperty).not.undefined;
    expect(instance.dateProperty).instanceof(Date);
  });
});
