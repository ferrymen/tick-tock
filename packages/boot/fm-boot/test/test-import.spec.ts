import 'mocha';
import { expect } from 'chai';
import { BootModule } from '../src';

describe('DI module', () => {
  it('tdd', () => {
    expect(BootModule).not.undefined;
  });
});
