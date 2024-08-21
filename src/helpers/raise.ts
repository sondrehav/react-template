/**
 * Throws an error.
 *
 * This simplifies capturing and checking a variable when a oneliner is all that
 * is needed.
 *
 * @example
 * For example instead of the following:
 * ```
 * const useExampleContext = (): string => {
 *   const value = useContext(Context);
 *   if(!value) {
 *     throw new Error("Context not set!");
 *   }
 *   return value;
 * }
 * ```
 *
 * You can use this method to make it an equivalent oneliner:
 *
 * ```
 * const useExampleContext = (): string => useContext(Context) ?? raise(new Error("Context not set!"));
 * ```
 *
 * @param error - The error to be thrown
 */
const raise = (error: Error): never => {
  throw error;
};
export default raise;
