import { SetMetadata, Type } from "@nestjs/common";

import { EVENT_LISTENER_METADATA } from "@/event.const";
import { IEvent } from "@/event.interface";

export const OnEvent = (event: Type<IEvent>) => SetMetadata(EVENT_LISTENER_METADATA, event);
