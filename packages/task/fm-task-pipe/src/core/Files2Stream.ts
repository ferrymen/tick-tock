/**
 * files to stream token.
 */
export const Files2StreamToken = new InjectToken<Files2StreamTranslator>(
  'Files2Stream'
);

/**
 * File to stream translator.
 *
 */
@Injectable(Files2StreamToken)
export class Files2StreamTranslator extends Translator<
  FileChanged,
  ITransform
> {
  /**
   * translate.
   *
   */
  translate(target: FileChanged): ITransform {
    let chg = target as FileChanged;
    if (chg.removed.length) {
      return src(chg.watch);
    } else {
      let srcs = chg.changed();
      if (srcs.length) {
        return src(srcs);
      }
    }
    return null;
  }
}
