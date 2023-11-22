export class MontimusError {
  // -- AUTHENTICATION ERRORS -- //
  public static readonly WRONG_USERNAME_OR_PASSWORD = new MontimusError(10000, 'Wrong username or password provided');

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
