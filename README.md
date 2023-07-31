# NestJS Events

Alternative event module for NestJS.

## Install

```sh
yarn add nestjs-events
```

`nestjs-events` works with NestJS (9 or 10) and RxJS 7, ensure your have those installed.

```sh
yarn add @nestjs/common@^10 rxjs@^7
```

## Usage

Register the event module in your app to be available globally

```ts
import { Module } from "@nestjs/common";
import { EventModule } from "nestjs-events";

@Module({
  imports: [
    EventModule.forRoot({
      prefix: "", // optional
    }),
  ],
})
export class AppModule {}
```

Or only for a specific module

```ts
import { Module } from "@nestjs/common";
import { EventModule } from "nestjs-events";

@Module({
  imports: [
    EventModule.register({
      prefix: "", // optional
    }),
  ],
})
export class MyOtherModule {}
```

Declare your events.

```ts
import { IEvent } from "nestjs-events";

export class MyEvent implements IEvent {
  public readonly value: number;
  public readonly other: string;

  constructor(parameters: { value: number; other: string });
}
```

You can also use the `EventBuilder` helper.

```ts
import { EventBuilder } from "nestjs-events";

export class MyEvent extends EventBuilder<{ value: number; other: string }>() {}
```

```ts
import { MyEvent } from "./my-event.event.ts";

new MyEvent();
```

Emit events with the `EventService`.

```ts
import { Injectable } from "@nestjs/common";
import { EventService } from "nestjs-events";

import { MyEvent } from "./my-event.event.ts";

@Injectable()
export class MyService {
  constructor(private readonly eventService: EventService) {}

  someMethod() {
    this.eventService.emit(new MyEvent({ value: 1, other: "hello" }));
  }
}
```

Listen to events through the `@OnEvent` decorator.

```ts
import { Injectable } from "@nestjs/common";
import { OnEvent } from "nestjs-events";

import { MyEvent } from "./my-event.event.ts";

@Injectable()
export class MyService {
  @OnEvent(MyEvent)
  handleMyEvent(event: MyEvent) {
    // event.value
    // event.other
  }
}
```

You can subscribe to events as well, returning an Observable.

```ts
import { Injectable } from "@nestjs/common";
import { OnEvent } from "nestjs-events";

import { MyEvent } from "./my-event.event.ts";

@Injectable()
export class MyService {
  constructor(private readonly eventService: EventService) {}

  someMethod() {
    eventService.on(MyEvent).pipe().subscribe();
  }
}
```
