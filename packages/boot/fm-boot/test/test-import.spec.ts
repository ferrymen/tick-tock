import 'mocha';
import { expect } from 'chai';
import {
  BootModule,
  AnyApplicationBuilder,
  DefaultApplicationBuilder,
} from '../src';
import { ModuleA, ModuleB, ClassSevice } from './demo';

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

  it('should has bootstrap and import provider', async () => {
    let md = await builder.import(ModuleB);
    expect(md).to.not.null;
    expect(md.config.bootstrap).to.eq(ClassSevice);
    expect(md.container).to.not.undefined;
    expect(md.container.has('mark')).to.true;
    expect(md.container.get('mark')).eq('marked');
  });

  it('should has bootstrap, and auto wrid mark via inject.', async () => {
    let md = await builder.bootstrap(ModuleB);
    expect(md).to.not.null;
    // expect(md.bootstrap).to.eq(ClassSevice);
    // expect(md.container).to.not.undefined;
    // expect(md.container.has('mark')).to.true;
    expect(md.mark).eq('marked');
    expect(md.state).eq('started');
  });
});
