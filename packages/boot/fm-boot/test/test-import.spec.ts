import 'mocha';
import { expect } from 'chai';
import {
  BootModule,
  AnyApplicationBuilder,
  DefaultApplicationBuilder,
} from '../src';
import { ModuleA } from './demo';

describe('DI module', () => {
  let builder: AnyApplicationBuilder;
  beforeEach(async () => {
    builder = DefaultApplicationBuilder.create();
    // builder.use(AopModule).use(Logger);
  });

  it('should has no bootstrap', async () => {
    let md = await builder.import(ModuleA);
    expect(md).to.not.null;
    expect(md.config.bootstrap).to.undefined;
    expect(md.container).to.not.undefined;
    expect(md.container.has('mark')).to.true;
    expect(md.container.get('mark')).eq('marked');
  });
});
