import { Inject, Injectable, Type } from "@nestjs/common";
import { EventEmitter } from "node:events";
import { fromEvent, Observable, take } from "rxjs";

import { MODULE_OPTIONS_TOKEN } from "./event.module-definition";
import { EventModuleOptions } from "./event.module-options";

@Injectable()
export class EventService {
  private readonly emitter = new EventEmitter({ captureRejections: true });

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: EventModuleOptions,
  ) {}

  #getEventName<TEvent>(event: string | Type<TEvent>) {
    return `${this.options.prefix ?? ""}${
      typeof event === "string" ? event : event.name
    }`;
  }

  public on<TEvent>(event: Type<TEvent>): Observable<TEvent>;
  public on<TEvent>(event: string): Observable<TEvent>;
  public on<TEvent>(event: string | Type<TEvent>): Observable<TEvent> {
    return fromEvent(
      this.emitter,
      this.#getEventName(event),
    ) as Observable<TEvent>;
  }

  public once<TEvent>(event: Type<TEvent>): Observable<TEvent>;
  public once<TEvent>(event: string): Observable<TEvent>;
  public once<TEvent>(event: string | Type<TEvent>): Observable<TEvent> {
    return typeof event === "string"
      ? this.on<TEvent>(event).pipe(take(1))
      : this.on(event).pipe(take(1));
  }

  public off(): void;
  public off<TEvent>(event: Type<TEvent>): void;
  public off(event: string): void;
  public off<TEvent>(event?: string | Type<TEvent>): void {
    this.emitter.removeAllListeners(
      event ? this.#getEventName(event) : undefined,
    );
  }

  public emit<TEvent>(event: InstanceType<Type<TEvent>>): boolean;
  public emit<TEvent>(type: string, event: TEvent): boolean;
  public emit<TEvent>(
    type: string | InstanceType<Type<TEvent>>,
    event?: TEvent,
  ): boolean {
    if (typeof type === "string") {
      return this.emitter.emit(this.#getEventName(type), event);
    }

    if (!event) {
      return this.emitter.emit(this.#getEventName(type.constructor.name), type);
    }

    throw new TypeError("Invalid arguments");
  }
}
