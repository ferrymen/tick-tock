export const PipeActivityContextToken = new InjectActivityContextToken(
  PipeActivity
);

/**
 * pipe activity context.
 *
 */
@Injectable(PipeActivityContextToken)
export class PipeActivityContext extends NodeActivityContext
  implements IActivityContext<ITransform> {
  data: ITransform;
  sourceMaps: SourceMapsActivity;

  constructor(
    @Inject(InputDataToken) input: any,
    @Inject(NodeContextToken) context: INodeContext
  ) {
    super(input, context);
  }

  protected getTranslator(input: any): ITranslator {
    if (input instanceof FileChanged) {
      return this.context.getContainer().get(Files2StreamToken);
    }
    return null;
  }

  protected translate(input: any): any {
    if (isArray(input)) {
      return src(input.filter(i => isString(i) || isArray(i)));
    } else if (isString(input)) {
      return src(input);
    } else if (input instanceof Stream) {
      return input;
    }

    return null;
  }
}
