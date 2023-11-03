import { sendResponse } from '../helpers/response'
import { Route } from '../route'
import { prisma } from '../backend'
import { comparePassword } from '../auth/hash'
import { createUserToken } from '../auth/jwt'
import { PermissionLevel } from '../helpers/permissions'

export default {
  path: '/login',
  method: 'POST',
  permissionLevel: PermissionLevel.NONE,
  async handler(req, res) {
    const { username, password } = req.body

    if (!username || !password) {
      sendResponse(res, 400, 'Username and password are required')
      return
    }

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      sendResponse(res, 401, 'Invalid username or password')
      return
    }

    const passwordMatch = comparePassword(password, user.password)

    if (!passwordMatch) {
      sendResponse(res, 401, 'Invalid username or password')
      return
    }

    // const token = createUserToken(user)
    const session = await prisma.userSessions.create({
      data: {
        user: { connect: { id: user.id } },
        jwt: createUserToken(user),
        name: `${req.ip} - ${req.headers['user-agent']}`,
      },
    })

    sendResponse(res, 200, 'Login successful', session)
  },
} as Route
