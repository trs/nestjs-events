import { Inject, Injectable, Type } from "@nestjs/common";
import { EventEmitter } from "node:events";
import { fromEvent, Observable, take } from "rxjs";

import { MODULE_OPTIONS_TOKEN } from "./event.module-definition";
import { EventModuleOptions } from "./event.module-options";
import { IEvent } from "./event.interface";

@Injectable()
export class EventService {
  private readonly emitter = new EventEmitter({ captureRejections: true });

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: EventModuleOptions,
  ) {}

  #getEventName(name: string) {
    return (this.options.prefix ?? "") + name;
  }

  public on<T extends IEvent>(EventClass: Type<T>): Observable<T> {
    return fromEvent(
      this.emitter,
      this.#getEventName(EventClass.name),
    ) as Observable<T>;
  }

  public once<T extends IEvent>(EventClass: Type<T>): Observable<T> {
    return this.on(EventClass).pipe(take(1));
  }

  public off(EventClass?: Type<IEvent>): void {
    this.emitter.removeAllListeners(
      EventClass ? this.#getEventName(EventClass.name) : undefined,
    );
  }

  public emit(event: IEvent): boolean {
    return this.emitter.emit(this.#getEventName(event.constructor.name), event);
  }
}
