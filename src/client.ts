import type { InputPayload } from "./input";
import type { ResponseArtifact } from "./response";

export type Job<T> = Omit<InputPayload<T>, "type">;

export type JobInput = <T>(
  input: Job<T>,
  url: string,
  headers?: { [key: string]: string },
) => Promise<string>;

export type JobResponse = <T>(
  id: string,
  url: string,
) => Promise<ResponseArtifact<T> | null>;

export type PollFunction = <T, G>(
  input: Job<T>,
  url: string,
  subscribe?: SubscribeFunction,
) => Promise<ResponseArtifact<G>>;

export type SubscribeFunction = <G>(data: ResponseArtifact<G>) => void;
