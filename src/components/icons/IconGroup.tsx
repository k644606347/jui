import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface IconGroup {
    default: IconDefinition;
    [k: string]: IconDefinition;
}