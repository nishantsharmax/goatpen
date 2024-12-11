import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import Joi from "joi";

const TheAuthUser = {
  id: "1",
  username: "admin",
  password: process.env.ADMIN_PASSWORD,
};

const schema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    "*": "Wrong credentials",
  }),
  password: Joi.string().required().messages({
    "*": "Wrong credentials",
  }),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { error, value } = schema.validate(data);

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 },
      );
    }

    const { username, password } = value;

    if (
      username !== TheAuthUser.username ||
      password !== TheAuthUser.password
    ) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }
    const user = TheAuthUser;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("1d")
      .sign(secret);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Set expiration to 1 day from now

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("goat-pen-token", token, {
      maxAge: 60 * 60 * 24, // 1 day (matching token expiration)
      sameSite: "strict",
      path: "/", // Send the cookie with all requests
    });

    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
