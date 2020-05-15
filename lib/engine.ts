import { EventEmitter } from "https://deno.land/std/node/events.ts";
import { Block } from "./block.ts";

export declare interface Engine {
  /**
   * It fires when the engine has ended the execution.
   * @param event
   * @param listener
   */
  on(
    event: "end",
    listener: (args: { result: any[]; time: number }) => void
  ): this;

  /**
   * The execution has started.
   * @param event
   * @param listener
   */
  on(
    event: "start",
    listener: (args: { id: string; params: any[]; result: any[] }) => void
  ): this;

  /**
   * A block has been executed.
   * @param event
   * @param listener
   */
  on(
    event: "block result",
    listener: (args: { id: string; params: any[]; result: any[] }) => void
  ): this;

  /**
   * An error has ocurred.
   * @param event
   * @param listener
   */
  on(
    event: "error",
    listener: (args: { id: String; params: any[]; error: any }) => void
  ): this;

  on(event: string, listener: (args: any) => void): this;
}
/**
 * @author krthr
 */
export class Engine extends EventEmitter {
  /**
   * The block that will be executed.
   */
  private actualBlock?: Block;

  /**
   * The ID of the the actual block.
   */
  private actualId?: string;

  /**
   * Parameters that will be passed to the execution of the `actualBlock`
   */
  private params: any;

  /**
   * Millis
   */
  private startTime: number = 0;
  private endTime: number = 0;

  constructor(
    private blocks: { [id: string]: Block },
    private route: {
      [id: string]: string | Function;
    } = {}
  ) {
    super();
  }

  /**
   * Start the engine.
   *
   * @param initId
   * @param args
   */
  async start(initId: string, ...args: any[]) {
    this.actualId = initId;
    this.params = this.parseParams(args);

    this.startTime = Date.now();

    this.emit("start", {
      id: initId,
      params: this.params,
      startTime: this.startTime,
    });

    while (true) {
      if (!this.actualId) break;

      this.actualBlock = this.blocks[this.actualId as string];

      if (!this.actualBlock) break;

      try {
        const result = await this.actualBlock.run(...this.params);

        this.emitBlock(this.actualId, this.params, result);

        this.params = this.parseParams(result);
        this.actualId = await this.getNextId(this.params);
      } catch (error) {
        this.emit("error", {
          id: this.actualId,
          params: this.params,
          error,
        });
      }
    }

    this.endTime = Date.now();

    this.emit("end", {
      result: this.params,
      time: this.endTime - this.startTime,
    });
  }

  private emitBlock(id: string | number | null, params: any, result: any) {
    this.emit("block result", { id, params, result });
    this.emit(`block ${id} result`, { id, params, result });
  }

  /**
   * Parse the params.
   *
   * The params must are converted to an array.
   */
  private parseParams(args: any): any[] {
    if (typeof args === "undefined" || args === null) return [];

    if (!Array.isArray(args)) {
      return [].concat(args);
    }

    return args;
  }

  /**
   * Get next block.
   *
   * If the next block was defined as a function in the
   * `route` object, the function is executed with the params
   * of the last runned block.
   *
   * @param result
   */
  private async getNextId(result: any): Promise<string> {
    const next = this.route[this.actualId as string];

    if (typeof next === "function") {
      return next(...result);
    }

    return next;
  }
}
