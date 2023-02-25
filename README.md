# NestJS Events

Alternative event module for NestJS.

## Install

```sh
yarn add nestjs-events
```

`nestjs-events` works with NestJS 9 and RxJS 7, ensure your have those installed.

```sh
yarn add @nestjs/common@^9 rxjs@^7
```

## Usage

Register the event module in your app

```ts
import { Module } from '@nestjs/common';
import { EventModule } from 'nestjs-events';

@Module({
  imports: [
    EventModule.register({
      prefix: '' // optional
    })
  ]
})
export class AppModule {}
```

Declare your events.

```ts
import { IEvent } from 'nestjs-events';

export class MyEvent implements IEvent {
  constructor(
    public readonly value: number,
    public readonly other: string
  )
}
```

Emit events with the `EventService`.

```ts
import { Injectable } from '@nestjs/common';
import { EventService } from 'nestjs-events';

import { MyEvent } from './my-event.event.ts';

@Injectable()
export class MyService {
  constructor(
    private readonly eventService: EventService
  ) {}

  someMethod() {
    this.eventService.emit(new MyEvent(1, 'hello'));
  }
}
```

Listen to events through the `@OnEvent` decorator.

```ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from 'nestjs-events';

import { MyEvent } from './my-event.event.ts';

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
import { Injectable } from '@nestjs/common';
import { OnEvent } from 'nestjs-events';

import { MyEvent } from './my-event.event.ts';

@Injectable()
export class MyService {
  constructor(
    private readonly eventService: EventService
  ) {}

  someMethod() {
    eventService.on(MyEvent)
      .pipe()
      .subscribe();
  }
}
```
