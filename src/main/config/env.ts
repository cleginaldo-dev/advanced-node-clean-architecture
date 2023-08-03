export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '2465464003623649',
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? '84c5ceb01a6df05bd5a35aac09a40d72'
  },
  port: process.env.PORT ?? 4444,
  jwtSecret: process.env.JWT_SECRET ?? 'k90df8hd0f808dfg8d09'
}
