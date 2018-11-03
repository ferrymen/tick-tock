/**
 * transform interface.
 *
 */
export interface ITransform extends ObjectMap<any>, NodeJS.ReadWriteStream {
  /**
   * set the stream source as origin.
   *
   */
  changeAsOrigin?: boolean;
}
