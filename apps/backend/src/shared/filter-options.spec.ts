import { Request } from "express";

import { FilterOptions } from "./filter-options";

class TestUser {
  id: string;
  name: string;
  age: number;

  profile: any;
  posts: any;
}

function mockRequest(query: any = {}, params: any = {}): Request {
  return {
    query,
    params
  } as any as Request;
}

describe("FilterOptions.fromRequest", () => {

  test("should create filters from filter[x] syntax", () => {
    const req = mockRequest({
      "filter[name]": "John",
      "filter[age]": "30"
    });

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name", "age" ]);

    expect(result.where).toEqual({
      name: "John",
      age: "30"
    });
  });

  test("should ignore filters that are not allowed", () => {
    const req = mockRequest({
      "filter[name]": "John",
      "filter[age]": "30"
    });

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name" ]); // age is not allowed

    expect(result.where).toEqual({
      name: "John"
    });
  });

  test("should merge route params into where clause", () => {
    const req = mockRequest(
      { "filter[name]": "John" },
      { id: "999" }
    );

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name" ]);

    expect(result.where).toEqual({
      name: "John",
      id: "999"
    });
  });

  test("should convert string 'null' to actual null", () => {
    const req = mockRequest({
      "filter[name]": "null"
    });

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name" ]);

    expect(result.where).toEqual({
      name: null
    });
  });

  test("should set take (limit) and skip (offset)", () => {
    const req = mockRequest({
      limit: "10",
      offset: "5"
    });

    const result = FilterOptions.fromRequest<TestUser>(req);

    expect(result.take).toBe(10);
    expect(result.skip).toBe(5);
  });

  test("should set order fields correctly (ASC and DESC)", () => {
    const req = mockRequest({
      sort: [ "name", "-age" ]
    });

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name", "age" ]);
    expect(result.order).toEqual({
      name: "ASC",
      age: "DESC"
    });
  });

  test("should support sort[] syntax as well", () => {
    const req = mockRequest({
      "sort[]": [ "name", "-age" ]
    });

    const result = FilterOptions.fromRequest<TestUser>(req, [ "name", "age" ]);

    expect(result.order).toEqual({
      name: "ASC",
      age: "DESC"
    });
  });

  test("should filter allowed relations only", () => {
    const req = mockRequest({
      relations: [ "profile", "posts" ]
    });

    const result = FilterOptions.fromRequest<TestUser>(
      req,
      [],
      [ "profile" ] // only profile allowed
    );

    expect(result.relations).toEqual([ "profile" ]);
  });

  test("should support relations[] syntax", () => {
    const req = mockRequest({
      "relations[]": [ "profile", "posts", "wrong" ]
    });

    const result = FilterOptions.fromRequest<TestUser>(
      req,
      [],
      [ "profile", "posts" ]
    );

    expect(result.relations).toEqual([ "profile", "posts" ]);
  });

  test("should work when no filters, sorts, or relations are provided", () => {
    const req = mockRequest();

    const result = FilterOptions.fromRequest<TestUser>(req);

    expect(result.where).toEqual({});
    expect(result.order).toEqual({});
    expect(result.relations).toEqual([]);
  });

});
