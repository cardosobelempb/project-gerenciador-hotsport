import { BadRequestError } from '@/common'
import { dataSource } from '@/common/infrastructure/typeorm'
import { CreateHostUseCase } from '@/routeros/application/usecases/create-host.usecase'
import { createHostBodySchema } from '@/routeros/application/usecases/schemas/create-host-body.schema'
import { Request, Response } from 'express'
import z from 'zod'

import { HostTypeormEntity } from '../../typeorm/entities/host-typeorm.entity'
import { HostsTypeormRepository } from './../../typeorm/repositories/host-typeorm-repository.entity'

export async function createHostController(
  request: Request,
  response: Response,
) {
  const validateDate = createHostBodySchema.safeParse(request.body)

  if (!validateDate.success) {
    console.error('Invalid data', z.treeifyError(validateDate.error))
    throw new BadRequestError(
      `${validateDate.error.issues.map(issue => {
        return `${issue.path.join('.')} -> ${issue.message}`
      })}`,
    )
  }

  const { address, macAddress, server, status, user, comment, toAddress } =
    validateDate.data

  const repository = new HostsTypeormRepository()
  repository.hostRepository = dataSource.getRepository(HostTypeormEntity)

  const createHostUseCase = new CreateHostUseCase.UseCase(repository)
  const host = await createHostUseCase.execute({
    address,
    macAddress,
    server,
    status,
    user,
    comment: comment ?? '',
    toAddress: toAddress ?? '',
  })

  return response.status(201).json(host)
}
