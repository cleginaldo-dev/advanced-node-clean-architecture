/* eslint-disable @typescript-eslint/no-unused-vars */
import { badRequest, HttpResponse, serverError } from '@/application/helpers'
import { IValidator, ValidationComposite } from '@/application/validation'

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>

  buildValidators(httpRequest: any): IValidator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error) {
      return badRequest(error)
    }
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
