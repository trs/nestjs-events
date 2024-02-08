import { Injectable, Module } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { EventModule } from "@/event.module";
import { EventService } from "@/event.service";
import { OnEvent } from "@/on-event.decorator";

describe("EventModule", () => {
  let moduleRef: TestingModule;
  let eventService: EventService;
  let eventMethod: jest.Mock;

  class TestEvent {
    constructor(public readonly a: number) {}
  }

  @Injectable()
  class TestService {
    @OnEvent(TestEvent)
    test(values: TestEvent) {
      eventMethod(values);
    }
  }

  @Module({
    providers: [TestService],
  })
  class TestModule {}

  beforeAll(async () => {
    eventMethod = jest.fn();

    moduleRef = await Test.createTestingModule({
      imports: [EventModule.forRoot(), TestModule],
    }).compile();

    await moduleRef.init();

    eventService = await moduleRef.resolve(EventService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it("should register OnEvent handlers", async () => {
    expect(eventService.emit(new TestEvent(1))).toBe(true);
    expect(eventMethod).toBeCalledWith({ a: 1 });
  });
});
