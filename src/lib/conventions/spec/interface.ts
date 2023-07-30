import type { InputPayload } from "./input";
import { ArgumentArtifact } from "./input";

export type WebBodyPayload<T> = Omit<
  InputPayload & { argument: ArgumentArtifact<T> },
  "argumentId" | "id"
>;
