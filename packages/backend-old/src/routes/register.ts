import { hashPassword } from '../auth/hash';
import { prisma } from '../backend';
import { PermissionLevel } from '../helpers/permissions';
import { sendResponse } from '../helpers/response';
import { Route } from '../route';

export default {
  path: '/register',
  method: 'POST',
  permissionLevel: PermissionLevel.NONE,
  async handler(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      sendResponse(res, 400, 'Username and password are required');
      return;
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      sendResponse(res, 401, 'Username already exists');
      return;
    }

    const hashedPassword = hashPassword(password);

    let newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    newUser.password = '';

    sendResponse(res, 200, 'Registration successful', newUser);
  },
} as Route;
