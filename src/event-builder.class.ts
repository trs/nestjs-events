import { IEvent } from "./event.interface";

export const EventBuilder = <T extends object>() => {
  const Event = class Event implements IEvent {
    constructor(parameters: T) {
      Object.assign(this, parameters);
    }
  };

  return Event as new (args: T) => IEvent & Readonly<T>;
};
