import servc, { send, getJob } from "./index";
import { STATUSCODE } from "./response";

const url = process.env["API_URL"] || "http://localhost:3000";
const route = process.env["TEST_QUEUE"] || "test";

it("should send a job", async () => {
  const id = await send(
    {
      route,
      argument: {
        method: "simple",
        inputs: "my input",
      },
    },
    url,
  );

  expect(typeof id).toBe("string");
});

it("should retrieve response artifact", async () => {
  const id = await send(
    {
      route,
      argument: {
        method: "test",
        inputs: 123123,
      },
    },
    url,
  );

  const response = await getJob(id, url);
  if (response) {
    expect(response.isError).toBe(false);
    expect(response.responseBody).toBe(false);
    expect(response.progress).toBe(100);
    expect(response.statusCode).toBe(STATUSCODE.OK);
  }
});

it("should poll a job", async () => {
  const response = await servc(
    {
      route,
      argument: {
        method: "test",
        inputs: 123123,
      },
    },
    url,
  );

  expect(response.isError).toBe(false);
  expect(response.progress).toBe(100);
  expect(response.statusCode).toBe(STATUSCODE.OK);
});

it("should poll for errors", async () => {
  const response = await servc(
    {
      route,
      argument: {
        method: "fail",
        inputs: 123123,
      },
    },
    url,
  );

  expect(response.isError).toBe(true);
  expect(response.progress).toBe(100);
  expect(response.statusCode).toBe(STATUSCODE.SERVER_ERROR);
});

it("should poll for non existent method", async () => {
  const response = await servc(
    {
      route,
      argument: {
        method: "asdad",
        inputs: 123123,
      },
    },
    url,
  );

  expect(response.isError).toBe(true);
  expect(response.progress).toBe(100);
  expect(response.statusCode).toBe(STATUSCODE.METHOD_NOT_FOUND);
});
