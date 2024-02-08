import { EVENT_LISTENER_METADATA } from "@/event.const";

export const OnEvent = (...event: unknown[]) => {
  const decoratorFactory: MethodDecorator & {
    KEY: typeof EVENT_LISTENER_METADATA;
  } = (target, _key, descriptor) => {
    if (descriptor) {
      const existing =
        Reflect.getMetadata(EVENT_LISTENER_METADATA, descriptor.value) ?? [];

      Reflect.defineMetadata(
        EVENT_LISTENER_METADATA,
        [...existing, ...event],
        descriptor.value,
      );
      return descriptor;
    }

    const existing = Reflect.getMetadata(EVENT_LISTENER_METADATA, target) ?? [];

    Reflect.defineMetadata(
      EVENT_LISTENER_METADATA,
      [...existing, ...event],
      target,
    );
    return target;
  };
  decoratorFactory.KEY = EVENT_LISTENER_METADATA;
  return decoratorFactory;
};
