import { prisma } from '@swissokyo/db';

// Example inside an API route
const users = await prisma.user.findMany();

console.log(users);