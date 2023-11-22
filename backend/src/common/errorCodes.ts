export class MontimusError {
  // -- AUTHENTICATION ERRORS -- //
  public static readonly WRONG_USERNAME_OR_PASSWORD = new MontimusError(10000, 'Wrong username or password provided');
  public static readonly MISSING_AUTH_TOKEN = new MontimusError(10001, 'Missing authentication token');
  public static readonly INVALID_AUTH_TOKEN = new MontimusError(10002, 'Invalid authentication token');
  public static readonly UNAUTHORIZED = new MontimusError(10003, 'Unauthorized');
  public static readonly ALREADY_AUTHENTICATED = new MontimusError(10004, 'Already authenticated');
  public static readonly EXPIRED_AUTH_TOKEN = new MontimusError(10005, 'Expired authentication token');

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
