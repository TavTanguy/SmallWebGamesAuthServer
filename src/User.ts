import { decode, verify, sign } from "jsonwebtoken";

export default class User {
  public static keyJWT: string;
  public name: string;
  public avatar: string;

  public constructor(token: string);
  public constructor(name: string, avatar?: string);
  public constructor(nameOrToken: string, avatar?: string) {
    if (!avatar) {
      const objToken: any = User.keyJWT ? verify(nameOrToken, User.keyJWT) : decode(name);
      if (!objToken?.name || !objToken.avatar) throw new Error("Invalid token");
      this.name = objToken.name;
      this.avatar = objToken.avatar;
    } else {
      this.name = nameOrToken;
      this.avatar = avatar;
    }
  }

  public toString() {
    if (!User.keyJWT) throw new Error("keyJWT not found");
    return sign(
      {
        name: this.name,
        avatar: this.avatar,
      },
      User.keyJWT,
      {
        expiresIn: "2h",
      }
    );
  }
}
