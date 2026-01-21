import { Request, Response } from 'express'

import { RouterosClient } from '../../routeros'

export interface HotspotActive {
  user: string
  address: string
  macAddress: string
  uptime: string
}
/**
 * Controller responsável APENAS por lidar com HTTP.
 * Não deve conter regra de negócio complexa.
 */
export class LoginController {
  constructor(private readonly router: RouterosClient) {}

  public async handle(req: Request, res: Response): Promise<HotspotActive[]> {
    const { host, username, password } = req.body
    const rawData = await this.router.write(['/ip/hotspot/active/print'])

    // Mapeando dados RouterOS para DTO tipado
    return rawData.map(item => ({
      user: item.user,
      address: item.address,
      macAddress: item['mac-address'],
      uptime: item.uptime,
    }))
  }
}
