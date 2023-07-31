import { EventBuilder } from "@/event-builder.class";

describe("EventBuilder", () => {
  it("creates an event class", () => {
    type MyEventParameters = {
      value: number;
      optional?: string;
    };
    class MyEvent extends EventBuilder<MyEventParameters>() {}

    const event = new MyEvent({ value: 1 });

    expect(event.value).toBe(1);
    expect(event.optional).toBeUndefined();
  });
});
