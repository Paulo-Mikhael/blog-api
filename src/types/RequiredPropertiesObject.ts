import type { PropertiesObject } from "./PropertiesObject";

export type RequiredPropertiesObject = {
  properties: PropertiesObject;
  requiredProperties: string[];
};
