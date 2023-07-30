import { InputType } from "./lib/conventions/spec/input";
import type { WebBodyPayload } from "./lib/conventions/spec/interface";
import {
  STATUSCODES,
  type ResponseArtifact,
} from "./lib/conventions/spec/response";

export type Job<T> = Omit<WebBodyPayload<T>, "type">;

export type JobInput = <T>(input: Job<T>, url: string) => Promise<string>;

export type JobResponse = <T>(
  id: string,
  url: string
) => Promise<ResponseArtifact<T>>;

export type BulkJob = Omit<
  {
    [key: string]: Job<any>;
  },
  "route"
>;

export type BulkJobInput = (input: BulkJob, url: string) => Promise<string>;

export type BulkResponse<T extends BulkJob> = {
  responseBody: { [key in keyof T]: ResponseArtifact<T[key]>["responseBody"] };
} & Omit<ResponseArtifact<any>, "responseBody">;

export type BulkJobResponse = <T extends BulkJob>(
  id: string,
  url: string
) => Promise<BulkResponse<T>>;

export const sendJob: JobInput = async <T>(input: Job<T>, url: string) => {
  const bodyPayload: WebBodyPayload<T> = {
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

export const sendBulkJob: BulkJobInput = (
  input: BulkJob,
  url: string,
  separator: [string, string] = [":", "|"]
) =>
  Promise.all(
    Object.entries(input).map(([key, value]) =>
      sendJob(value, url).then((id) => `${key}${separator[0]}${id}`)
    )
  ).then((res) => res.join(separator[1]));

// @ts-ignore
export const getBulkReponse: BulkJobResponse = async <T extends BulkJob>(
  id: string,
  url: string,
  separator: [string, string] = [":", "|"]
) => {
  const response: Omit<BulkResponse<T>, "responseBody"> = {
    id,
    progress: 0,
    statusCode: STATUSCODES.OK,
    isError: false,
  };

  // @ts-ignore
  const jobs: [string, string][] = id
    .split(separator[1])
    .map((id) => id.split(separator[0]));
  const responseBulk: [string, T][] = [];
  for (const [key, jobid] of jobs) {
    const jobResponse = await getJob<T>(jobid, url);
    response.progress += jobResponse.progress;

    // error will always persist
    if (jobResponse.isError && !response.isError) {
      response.statusCode = jobResponse.statusCode;
      response.isError = true;
    }

    responseBulk.push([key, jobResponse.responseBody]);
  }
  response.progress = response.progress / jobs.length;

  // @ts-ignore
  return { ...response, responseBody: Object.fromEntries(responseBulk) };
};

export type PollFunction = <T, G>(
  input: T extends BulkJob ? BulkJob : Job<T>,
  url: string
  // @ts-ignore
) => Promise<T extends BulkJob ? BulkResponse<T> : ResponseArtifact<G>>;
export type PollOutputGrabber<T> = T extends BulkJob
  ? BulkJobResponse
  : JobResponse;

// @ts-ignore
export const poll: PollFunction = async <T extends unknown>(
  input: T extends BulkJob ? BulkJob : Job<T>,
  url: string,
  subscribe: (data: Awaited<ReturnType<PollFunction>>) => void = () => true
) => {
  let id: string = "";
  if (input.route && typeof input.route === "string") {
    id = await sendJob(input, url);
  } else {
    // @ts-ignore
    id = await sendBulkJob(input, url);
  }
  // @ts-ignore
  const outputFunction: PollOutputGrabber<T> =
    !input.route || typeof input.route !== "string" ? getBulkReponse : getJob;

  const getResponse: () => ReturnType<PollFunction> = () =>
    outputFunction(id, url);

  let response = await getResponse();
  while (response.progress < 1) {
    response = await getResponse();
    subscribe(response);
  }

  return response;
};
