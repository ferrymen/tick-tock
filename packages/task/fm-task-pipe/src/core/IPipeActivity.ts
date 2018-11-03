/**
 * pipe task.
 *
 */
export interface IPipeActivity extends GActivity<ITransform> {
  /**
   * pipe task
   *
   */
  run(data?: any): Promise<ITransform>;
}

/**
 * Inject Pipe Activity Token
 *
 */
export class InjectPipeActivityToken<
  T extends IPipeActivity
> extends Registration<T> {
  constructor(desc: string) {
    super('PipeActivity', desc);
  }
}

/**
 * pipe activity token.
 */
export const PipeActivityToken = new InjectPipeActivityToken<IPipeActivity>('');

/**
 * pipe activity builder token.
 */
export const PipeActivityBuilderToken = new InjectAcitityBuilderToken<
  IPipeActivity
>(PipeActivityToken);
