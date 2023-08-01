import {
  sendJob,
  getJob,
  BulkJob,
  sendBulkJob,
  getBulkReponse,
  poll,
} from "./index";
import { STATUSCODES } from "./lib/conventions/spec/response";

const url = process.env["API_URL"] || "http://localhost:3000";

const bulkJob: BulkJob = {
  test1: { route: "svc-sample", argument: { method: "complex", inputs: "hi" } },
  test2: { route: "svc-sample", argument: { method: "complex", inputs: "hi" } },
  test3: { route: "svc-sample", argument: { method: "complex", inputs: "hi" } },
  test4: { route: "svc-sample", argument: { method: "simple", inputs: "hi" } },
};

it("should send a job", async () => {
  const id = await sendJob(
    {
      route: "hello",
      argument: {
        method: "simple",
        inputs: "my input",
      },
    },
    url
  );

  expect(typeof id).toBe("string");
});

it("should retrieve response artifact", async () => {
  const id = await sendJob(
    {
      route: "svc-sample",
      argument: {
        method: "complex",
        inputs: "my input",
      },
    },
    url
  );

  const response = await getJob(id, url);
  expect(response.isError).toBe(false);
  expect(response.responseBody).toBe("complex");
  expect(response.progress).toBe(1);
});

it("should send a bulk job", async () => {
  const id = await sendBulkJob(bulkJob, url);
  const idSplit = id.split("|").filter((id) => id.includes(":"));
  const jobs = [...new Set(idSplit.map((id) => id.split(":")[1]))];

  expect(typeof id).toBe("string");
  expect(idSplit).toHaveLength(4);
  expect(jobs).toHaveLength(2);
});

it("should get the response from a bulk job", async () => {
  const id = await sendBulkJob(bulkJob, url);
  const response = await getBulkReponse(id, url);

  expect(response.isError).toBe(false);
  expect(response.progress).toBe(1);
  expect(response.statusCode).toBe(STATUSCODES.OK);
  expect(Object.keys(response.responseBody)).toHaveLength(4);
  expect(response.responseBody["test1"]).toBe("complex");
  expect(response.responseBody["test2"]).toBe("complex");
  expect(response.responseBody["test3"]).toBe("complex");
  expect(response.responseBody["test4"]).toBe(true);
});

it("should fail the whole job if one fails", async () => {
  const id = await sendBulkJob(
    {
      ...bulkJob,
      test5: {
        route: "svc-sample",
        argument: { method: "asdas", inputs: "hi" },
      },
    },
    url
  );
  const response = await getBulkReponse(id, url);

  expect(response.isError).toBe(true);
  expect(response.progress).toBe(1);
  expect(response.statusCode).toBe(STATUSCODES.USER_ERROR);
});

it("should poll a job", async () => {
  const response = await poll<BulkJob, any>(bulkJob, url);

  expect(response.isError).toBe(false);
  expect(response.progress).toBe(1);
  expect(response.statusCode).toBe(STATUSCODES.OK);
  expect(Object.keys(response.responseBody)).toHaveLength(4);
  expect(response.responseBody["test1"]).toBe("complex");
  expect(response.responseBody["test2"]).toBe("complex");
  expect(response.responseBody["test3"]).toBe("complex");
  expect(response.responseBody["test4"]).toBe(true);
});
