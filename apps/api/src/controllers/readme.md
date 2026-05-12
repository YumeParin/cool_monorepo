// export const getPosts = catchAsync(
//   //              1. Params   2. ResBody  3. ReqBody    4. Query (The Target!)
//   //                 |           |           |             |
//   async (req: Request<{},         {},         {},           GetPostsInput>, res: Response) => {

//     // NOW TypeScript knows that req.query matches GetPostsInput
//     const { page, limit } = req.query;

//     // page is now strictly a NUMBER (because of z.coerce.number() in your schema)
//     const posts = await postService.getPosts(page, limit);

//     return res.status(HTTP_STATUS.OK).json({ success: true, data: posts });
//   },
// );