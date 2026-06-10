import { Request, Response } from 'express';
import { catchAsync } from '@/utils/catchAsync';
import { HTTP_STATUS } from '@/constants/httpStatus';

import * as authService from '@/services/auth.service';
import { LoginAuthInput, SignupAuthInput, RefreshAuthInput } from '@/validations/auth.schema';

export const signup = catchAsync(async (req: Request<{}, {}, SignupAuthInput>, res: Response) => {
  const { email, password, name } = req.body;

  const safeUser = await authService.signup(email, password, name);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: safeUser,
  });
});

export const login = catchAsync(async (req: Request<{}, {}, LoginAuthInput>, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshTokenString } = await authService.login(email, password);

  res.cookie('refreshToken', refreshTokenString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: { accessToken: accessToken } });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { newAccessToken, newRefreshTokenString } = await authService.refresh(oldRefreshToken);

  res.cookie('refreshToken', newRefreshTokenString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(HTTP_STATUS.CREATED).json({ success: true, data: { accessToken: newAccessToken } });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: { message: 'Successfully logged out.' } });
});
