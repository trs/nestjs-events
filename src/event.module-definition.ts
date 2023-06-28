import { ConfigurableModuleBuilder } from "@nestjs/common";

import { EventModuleOptions } from "./event.module-options";

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<EventModuleOptions>().build();
