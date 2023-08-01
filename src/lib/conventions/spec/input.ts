export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum InputType {
  INPUT = "input",
  EVENT = "event",
}

export interface GenericInput {
  type: InputType;
  route: string;
  instanceId: string;
}

export interface InputPayload extends Optional<GenericInput, "instanceId"> {
  type: InputType.INPUT;
  id: string;
  argumentId: string;
}

export interface ArgumentArtifact<T> {
  method: string;
  inputs: T;
}
