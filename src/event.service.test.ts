import { map } from "rxjs";
import { TestScheduler } from "rxjs/testing";

import { EventService } from "@/event.service";

describe("EventService", () => {
  let eventService: EventService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    eventService = new EventService({ prefix: "test-" });
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("subscribes to events", () => {
    class TestEvent {
      constructor(public readonly value: number) {}
    }

    const sub = eventService.on(TestEvent);

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(
        cold("a-b", { a: 1, b: 2 }).pipe(
          map((value) => eventService.emit(new TestEvent(value))),
        ),
      );

      expectObservable(sub).toBe("a-b", {
        a: new TestEvent(1),
        b: new TestEvent(2),
      });
    });
  });

  it("supports event types as strings", () => {
    const sub = eventService.on<number>("test-event");

    testScheduler.run(({ cold, expectObservable }) => {
      expectObservable(
        cold("a-b", { a: 1, b: 2 }).pipe(
          map((value) => eventService.emit("test-event", value)),
        ),
      );

      expectObservable(sub).toBe("a-b", { a: 1, b: 2 });
    });
  });
});
