import { HTTPContext } from "@/shared/http-context/http-context";

export function createHttpContextMock() {
  const req: any = {
    params: {},
    query: {},
    session: undefined,
    user: undefined,
    cookies: {}
  };

  const res: any = {
    cookie: jest.fn(),
    clearCookie: jest.fn()
  };
  return {
    req,
    res,
    params: {
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      shouldGetString: jest.fn(),
      shouldGetNumber: jest.fn(),
      shouldGetBoolean: jest.fn()
    },
    query: {
      getString: jest.fn(),
      getNumber: jest.fn(),
      getBoolean: jest.fn(),
      shouldGetString: jest.fn(),
      shouldGetNumber: jest.fn(),
      shouldGetBoolean: jest.fn()
    },
    session: undefined,
    user: undefined,

    get memberId() {
      return req.session?.tenants?.find(t => t.id === req.params["tenantId"])?.memberId;
    },

    getCookie: jest.fn((name: string) => req.cookies[name]),

    setCookie: jest.fn((name: string, value: string, options = {}) =>
      res.cookie(name, value, options)
    ),

    deleteCookies: jest.fn((names: string | string[]) => {
      const list = Array.isArray(names) ? names : [ names ];
      list.forEach(n => res.clearCookie(n));
    })
  };
}
