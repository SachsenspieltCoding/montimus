export class MontimusError {
  // -- GENERIC ERRORS -- //
  public static readonly UNKNOWN_ERROR = new MontimusError(10000, 'Unknown error');
  public static readonly INVALID_QUERY_PARAMS = new MontimusError(10001, 'Invalid query parameters');

  // -- AUTHENTICATION ERRORS -- //
  public static readonly WRONG_USERNAME_OR_PASSWORD = new MontimusError(10100, 'Wrong username or password provided');
  public static readonly MISSING_AUTH_TOKEN = new MontimusError(10101, 'Missing authentication token');
  public static readonly INVALID_AUTH_TOKEN = new MontimusError(10102, 'Invalid authentication token');
  public static readonly UNAUTHORIZED = new MontimusError(10103, 'Unauthorized');
  public static readonly ALREADY_AUTHENTICATED = new MontimusError(10104, 'Already authenticated');
  public static readonly EXPIRED_AUTH_TOKEN = new MontimusError(10105, 'Expired authentication token');
  public static readonly SESSION_NOT_FOUND = new MontimusError(10106, 'Session not found');

  // -- MONITORING ERRORS -- //
  public static readonly INVALID_MONITOR_TYPE = (type: string) =>
    new MontimusError(10100, `Invalid monitor type ${type}`);
  public static readonly MONITOR_NOT_FOUND = new MontimusError(10201, 'Monitor not found');

  constructor(
    private code: number,
    private defaultMessage: string,
  ) {}

  get status(): number {
    return this.code;
  }

  get message(): string {
    return this.defaultMessage;
  }

  /**
   * Returns a string representation of the error
   * @returns {string} A string representation of the error
   */
  public toString(): string {
    return `MontimusError: ${this.code} - ${this.defaultMessage}`;
  }

  /**
   * Returns an object that can be sent as a response to the client
   * @returns {object} An object that can be sent as a response to the client
   */
  public toJSON(): object {
    return {
      error: this.defaultMessage,
      statusCode: this.code,
    };
  }
}
