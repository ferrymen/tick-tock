import { DIModule } from '../src';

export class TestService {
  testFiled = 'test';
  test() {
    console.log('this is test');
  }
}

@DIModule({
  imports: [TestService],
  exports: [TestService],
})
export class ModuleCustom {}

@DIModule({
  imports: [ModuleCustom],
  providers: [{ provide: 'mark', useFactory: () => 'marked' }],
  exports: [ModuleCustom],
})
export class ModuleA {}
