import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  OnModuleInit,
  Type,
} from "@nestjs/common";
import { DiscoveryModule, DiscoveryService } from "@golevelup/nestjs-discovery";

import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  OPTIONS_TYPE,
} from "./event.module-definition";
import { EventService } from "./event.service";
import { EVENT_LISTENER_METADATA } from "./event.const";
import { mergeMap, of } from "rxjs";

@Module({
  imports: [DiscoveryModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule
  extends ConfigurableModuleClass
  implements OnModuleDestroy, OnModuleInit
{
  constructor(
    private readonly discover: DiscoveryService,
    private readonly eventService: EventService
  ) {
    super();
  }

  static register(options?: typeof OPTIONS_TYPE): DynamicModule {
    return super.register(options ?? {});
  }

  static registerAsync(options?: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return super.registerAsync(options ?? {});
  }

  static forRoot(options?: typeof OPTIONS_TYPE): DynamicModule {
    return {
      ...this.register(options),
      global: true,
    };
  }

  static forRootAsync(options?: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      ...this.registerAsync(options),
      global: true,
    };
  }

  async onModuleInit() {
    const providers = await this.discover.providerMethodsWithMetaAtKey<
      Type<Event>
    >(EVENT_LISTENER_METADATA);

    providers.forEach((provider) => {
      this.eventService
        .on(provider.meta)
        .pipe(mergeMap((value) => of(provider.discoveredMethod.handler(value))))
        .subscribe();
    });
  }

  onModuleDestroy() {
    this.eventService.off();
  }
}
