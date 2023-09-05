export class UserProfile {
  pictureUrl?: string

  initials?: string

  constructor(readonly id: string) {}

  setPicture({ name, pictureUrl }: { pictureUrl?: string; name?: string }) {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined) {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()?.toUpperCase() ?? ''}${
          firstLetters.pop()?.toUpperCase() ?? ''
        }`
      } else {
        this.initials = name.substring(0, 2)?.toUpperCase()
      }
    }
  }
}
