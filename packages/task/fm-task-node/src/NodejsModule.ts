import { DIModule } from '@ferrymen/fm-boot';
import * as core from './core';

@DIModule({
  imports: [core],
  exports: [core],
})
export class NodejsModule {}
