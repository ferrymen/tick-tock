/**
 * pointcut.
 *
 */
export interface IPointcut {
  /**
   * property or method name.
   *
   */
  name: string;
  /**
   * full name of property or method
   *
   */
  fullName: string;

  /**
   * method
   *
   */
  descriptor?: TypedPropertyDescriptor<any> | PropertyDescriptor;
}
