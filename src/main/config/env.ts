export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '2465464003623649',
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? '101f38721d356404b0bc4521eb23684e'
  },
  port: process.env.PORT ?? 4444,
  jwtSecret: process.env.JWT_SECRET ?? 'k90df8hd0f808dfg8d09'
}
