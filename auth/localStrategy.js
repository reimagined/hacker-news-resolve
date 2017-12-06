import uuid from 'uuid'

const getUserByName = async (executeQuery, name) => {
  const { user } = await executeQuery(
    `query ($name: String!) {
      user(name: $name) {
        id,
        name,
        createdAt
      }
    }`,
    { name: name.trim() }
  )

  return user
}

export default {
  strategy: {
    usernameField: 'username',
    passwordField: 'username',
    successRedirect: null
  },
  registerCallback: async ({ resolve, body }, username, password, done) => {
    const executeQuery = resolve.queryExecutors.graphql

    const existingUser = await getUserByName(executeQuery, username)

    if (existingUser) {
      done('User already exists')
    }

    try {
      const user = {
        name: username.trim(),
        id: uuid.v4()
      }

      await resolve.executeCommand({
        type: 'createUser',
        aggregateId: user.id,
        aggregateName: 'user',
        payload: user
      })

      done(null, user)
    } catch (error) {
      done(error.toString())
    }
  },
  loginCallback: async ({ resolve, body }, username, password, done) => {
    const user = await getUserByName(resolve.queryExecutors.graphql, username)

    if (!user) {
      done('No such user')
    }

    done(null, user)
  },
  failureCallback: (error, redirect) => {
    redirect(`/error?text=${error}`)
  }
}
