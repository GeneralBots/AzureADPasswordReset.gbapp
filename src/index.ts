"use strict"

import { IGBPackage, GBMinInstance, IGBCoreService } from 'botlib'
import { Sequelize } from 'sequelize-typescript'
import { ADAudit } from './model/ADModel'

import { ADResetPasswordDialogs } from './dialog/ADResetPasswordDialogs'

export class Package implements IGBPackage {
  onExchangeData(min: GBMinInstance, kind: string, data: any) {
    
  }
  sysPackages: IGBPackage[]

  public getDialogs(min: GBMinInstance) {
    return [ADResetPasswordDialogs.getDialog(min)];
  }

  async loadPackage(core: IGBCoreService, sequelize: Sequelize): Promise<void> {
    sequelize.addModels([ADAudit])
  }

  async unloadPackage(core: IGBCoreService)  {

  }

  async loadBot(min: GBMinInstance) {

  }

  async unloadBot(min: GBMinInstance) {

  }

  async onNewSession(min: GBMinInstance, dc: any) {

  }
}
