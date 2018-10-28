import 'mocha';
import { expect } from 'chai';
import { IContainer, DefaultContainerBuilder } from '../src';

describe('custom register test', () => {
  let container: IContainer;

  beforeEach(async () => {
    let builder = new DefaultContainerBuilder();
    container = await builder.build();
  });

  it('decorator toString is decorator name', () => {});
});
