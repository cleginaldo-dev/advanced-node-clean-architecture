export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '2465464003623649',
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? '84c5ceb01a6df05bd5a35aac09a40d72',
    accessToken:
      process.env.FB_ACCESS_TOKEN ??
      'EAAjCU5IkeuEBALeUfIupz07IQtNH28TJ74lMxEZCTvfGjy9lvaZBBoavYIWkBY3X31x5ZB291vsns7Yxelaha0rZBjTaaPFyzG4kzFlHjjzzvMRvQuug9137ZCCMVlSP9kXLjerCrtD3del0NzZAUM8bOfTD7zjylioR4mkqDTWwokYLhTjIVtbzGotZCZAaxRj6qL2Yk0MEdkgcqIR5hp1fRaKG0odSISEGBCxOaZApIZB6xe3TmtJg9z'
  },
  port: process.env.PORT ?? 4444,
  jwtSecret: process.env.JWT_SECRET ?? 'k90df8hd0f808dfg8d09'
}
