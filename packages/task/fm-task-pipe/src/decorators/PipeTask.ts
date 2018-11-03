export interface IPipeTaskMetadata extends IActivityMetadata, IPipeConfigure {}

export type PipeTaskMetadata = IPipeTaskMetadata & CoreActivityConfigs;

/**
 * pipe task decorator, use to define class is a pipe task element.
 *
 * @PipeTask
 */
export const PipeTask: ITaskDecorator<PipeTaskMetadata> = createTaskDecorator<
  PipeTaskMetadata
>('PipeTask', PipeActivityBuilderToken, PipeActivityToken);
