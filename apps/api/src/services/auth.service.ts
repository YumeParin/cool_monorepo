import bcrypt from "bcryptjs";
import { prisma } from "@swissokyo/db";
import { AppError } from "@/utils/AppError";
import { HTTP_STATUS } from "@/constants/httpStatus";
import jwt from "jsonwebtoken";

export const signup = async (email: string, password: string, name: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
      avatar:
        "https://i.pinimg.com/736x/db/66/56/db665610a4a2af19168af7c9c038455a.jpg",
    },
  });
  const { password: _, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new AppError(
      "Email or password ins incorrect.",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(
      "Email or password is incorrect.",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  const refreshTokenString = crypto.randomUUID();

  const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const savedRefreshToken = await prisma.refreshToken.create({
    data: {
      token: refreshTokenString,
      user: {
        connect: { id: user.id },
      },
      expireAt: expireDate,
    },
  });
  return { accessToken, refreshTokenString };
};

export const refresh = async (oldRefreshToken: string) => {
  if (!oldRefreshToken) {
    throw new AppError("No refresh token provided.", HTTP_STATUS.UNAUTHORIZED);
  }

  const dbToken = await prisma.refreshToken.findUnique({
    where: { token: oldRefreshToken },
    include: { user: true },
  });

  if (!dbToken) {
    throw new AppError("Invalid refresh token.", HTTP_STATUS.UNAUTHORIZED);
  }

  if (dbToken.revoked || dbToken.expireAt < new Date()) {
    throw new AppError(
      "Session expired. Please log in again.",
      HTTP_STATUS.UNAUTHORIZED,
    );
  }

  const newAccessToken = jwt.sign(
    { userId: dbToken.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  const newRefreshTokenString = crypto.randomUUID();
  const expireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: {
        revoked: true,
        replacedBy: newRefreshTokenString,
      },
    }),
    prisma.refreshToken.create({
      data: {
        token: newRefreshTokenString,
        user: { connect: { id: dbToken.userId } },
        expireAt: expireDate,
      },
    }),
  ]);
  return { newAccessToken, newRefreshTokenString };
};

export const logout = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });
};
