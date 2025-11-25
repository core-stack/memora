import { JWTService } from "./jwt.service";
import jwt from "jsonwebtoken";

// Mock environment variables
jest.mock("@/env", () => ({
  env: {
    JWT_SECRET: "test-secret",
    JWT_ACCESS_TOKEN_DURATION: 60,   // 1 minute
    JWT_REFRESH_TOKEN_DURATION: 3600 // 1 hour
  }
}));

jest.mock("jsonwebtoken");

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("JWTService", () => {
  let service: JWTService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new JWTService();
  });

  // -------------------------------------------------
  // generateTokens()
  // -------------------------------------------------
  it("should generate access and refresh tokens with correct payloads and durations", () => {
    mockedJwt.sign.mockImplementation((payload: any) => {
      return `signed-${payload.sessionId}-${payload.userId}`;
    });

    const result = service.generateTokens("session-123", "user-999");

    expect(mockedJwt.sign).toHaveBeenCalledTimes(2);

    // Access token
    expect(mockedJwt.sign).toHaveBeenCalledWith(
      { userId: "user-999", sessionId: "session-123" },
      "test-secret",
      { expiresIn: 60 }
    );

    // Refresh token
    expect(mockedJwt.sign).toHaveBeenCalledWith(
      { userId: "user-999", sessionId: "session-123" },
      "test-secret",
      { expiresIn: 3600 }
    );

    expect(result).toEqual({
      accessToken: "signed-session-123-user-999",
      refreshToken: "signed-session-123-user-999",
      accessTokenDuration: 60,
      refreshTokenDuration: 3600
    });
  });

  // -------------------------------------------------
  // verifyToken()
  // -------------------------------------------------
  it("should return decoded payload on valid token", () => {
    const decoded = { userId: "user-1", sessionId: "session-1" };

    mockedJwt.verify.mockReturnValue(decoded);

    const result = service.verifyToken("fake-token");

    expect(mockedJwt.verify).toHaveBeenCalledWith("fake-token", "test-secret");
    expect(result).toEqual(decoded);
  });

  it("should return null when JWT verification fails", () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const result = service.verifyToken("bad-token");

    expect(mockedJwt.verify).toHaveBeenCalledWith("bad-token", "test-secret");
    expect(result).toBeNull();
  });
});
