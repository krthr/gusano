/**
 * A Block.
 *
 * @author krthr
 */
export interface Block {
  /**
   * ID for the Block.
   * Every block in an engine must have an unique ID.
   */
  id: string;

  /**
   * Maybe a nice name ;)
   */
  name: string;

  /**
   * Version of the block.
   */
  version: string;

  /**
   * Function that will be executed when the block.
   */
  run: (...args: any[]) => any;
}
