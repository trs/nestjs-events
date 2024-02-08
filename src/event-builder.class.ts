export const EventBuilder = <T extends object>() => {
  const Event = class Event {
    constructor(parameters: T) {
      Object.assign(this, parameters);
    }
  };

  return Event as new (args: T) => Readonly<T>;
};
