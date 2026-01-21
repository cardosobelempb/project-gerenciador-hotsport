import { ErrorCode, NotFoundError } from '@/common'
import { dataSource } from '@/common/infrastructure/typeorm'
import { HostId, HostRepository } from '@/routeros/domain/repositories/host.repository'
import { Repository } from 'typeorm'

import { HostTypeormEntity } from '../entities/host-typeorm.entity'

export class HostsTypeormRepository implements HostRepository {
  sortableFields: string[] = ['name', 'created_at']

  hostRepostory: Repository<HostTypeormEntity>

  constructor() {
    this.hostRepostory = dataSource.getRepository(HostTypeormEntity)
  }

  create(entity: HostTypeormEntity): HostTypeormEntity {
    return this.hostRepostory.create(entity)
  }
  async insert(entity: HostTypeormEntity): Promise<HostTypeormEntity> {
    return this.hostRepostory.save(entity)
  }
  async findByName(name: string): Promise<HostTypeormEntity> {
    throw new Error('Method not implemented.')
  }
  async findAllByIds(hostIds: HostId[]): Promise<HostTypeormEntity[]> {
    throw new Error('Method not implemented.')
  }
  async conflictngName(name: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  async findById(id: string): Promise<HostTypeormEntity | null> {
    return this._get(id)
  }
  async save(entity: HostTypeormEntity): Promise<HostTypeormEntity> {
    return this.hostRepostory.save(entity)
  }
  async update(entity: HostTypeormEntity): Promise<HostTypeormEntity> {
    await this._get(entity.id.getValue())
    await this.hostRepostory.update({ id: entity.id.getValue() }, entity)
    return entity
  }
  async delete(entity: HostTypeormEntity): Promise<void> {
    await this._get(entity.id.getValue())
    this.hostRepostory.delete({ id: entity.id.getValue() })
  }

  protected async _get(id: string): Promise<HostTypeormEntity | null> {
    const host = await this.hostRepostory.findOneBy({ id })
    if (!host) {
      throw new NotFoundError(`${ErrorCode.ENTITY_NOT_FOUND} using Id: ${id}`)
    }

    return host
  }
}
