import { InputType, type InputPayload } from "./input";
import { STATUSCODE, type ResponseArtifact } from "./response";
import type {
  Job,
  JobInput,
  JobResponse,
  PollFunction,
  SubscribeFunction,
} from "./client";

export const send: JobInput = async <T>(input: Job<T>, url: string) => {
  const bodyPayload: InputPayload<T> = {
    type: InputType.INPUT,
    ...input,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyPayload),
  });
  return await res.text();
};

export const getJob: JobResponse = (id, url) =>
  fetch(`${url}/id/${id}`).then((res) => res.json());

export const poll: PollFunction = async <T, G>(
  input: Job<T>,
  url: string,
  subscribe?: SubscribeFunction,
) => {
  const id: string = await send(input, url);

  const getResponse = () => getJob<G>(id, url);

  let response: ResponseArtifact<G> = await getResponse();
  while (
    response.progress < 100 &&
    response.statusCode === STATUSCODE.OK &&
    !response.isError
  ) {
    response = await getResponse();
    if (subscribe) {
      subscribe(response);
    }
  }

  return response;
};

export default poll;
