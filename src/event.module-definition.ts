import { ConfigurableModuleBuilder } from "@nestjs/common";

import { EventModuleOptions } from "./event.module-options";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<EventModuleOptions>().build();
