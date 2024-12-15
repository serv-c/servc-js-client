import type { Hooks } from "./hooks";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export enum InputType {
  INPUT = "input",
  EVENT = "event",
}

export interface GenericInput {
  type: InputType;
  route: string;
  force?: boolean;
}

export interface InputPayload<T> extends Optional<GenericInput, "force"> {
  type: InputType.INPUT;
  id?: string;
  argument: ArgumentArtifact<T>;
}

export interface ArgumentArtifact<T> {
  method: string;
  inputs: T;
  hooks?: Hooks;
}
