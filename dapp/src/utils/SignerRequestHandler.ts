import { EventEmitter } from "events";
import { ResultAsync } from "neverthrow";
import { Signer } from "../contexts/useSymfoni";
var debug = require("debug")("utils:SignatureRequestHandler");
export interface ErrorResponse {
  code: number;
  message: string;
  data?: string;
}
export type SignatureRequest = {
  fn: (signer: Signer) => Promise<any>;
  message: string;
  data?: Record<string, string>;
};

export class SignatureRequestHandler {
  private events = new EventEmitter();

  public on(event: string, listener: any): void {
    this.events.on(event, listener);
  }
  public once(event: string, listener: any): void {
    this.events.once(event, listener);
  }
  public removeListener(event: string, listener: any): void {
    this.events.removeListener(event, listener);
  }
  public off(event: string, listener: any): void {
    this.events.off(event, listener);
  }
  public add(signatureRequestFunctions: SignatureRequest[]) {
    this.events.emit("onRequests", [signatureRequestFunctions]);
  }

  public done(result: any[]) {
    debug("SignatureRequestHandler done()", result);
    this.events.emit("done", result);
  }

  public reject(reason?: ErrorResponse) {
    debug("SignatureRequestHandler reject()", reason);
    this.events.emit("rejected", reason);
  }

  handleDone(resolve: () => void) {
    resolve();
    this.clear();
  }

  handleRejected(reject: () => void) {
    reject();
    this.clear();
  }

  async results() {
    return new Promise((resolve, reject) => {
      this.events.on("done", event => this.handleDone(() => resolve(event)));
      this.events.on("rejected", event => this.handleRejected(() => reject(event)));
    });
  }
  async resultsNT<T>() {
    return ResultAsync.fromPromise<T, Error>(
      new Promise((resolve, reject) => {
        this.events.on("done", event => this.handleDone(() => resolve(event)));
        this.events.on("rejected", event => this.handleRejected(() => reject(event)));
      }),
      () => new Error("Noe gikk galt"),
    );
  }
  public clear() {
    this.events.emit("onClear", []);
    this.events.removeListener("done", this.handleDone);
    this.events.removeListener("rejected", this.handleDone);
  }
}
