"use strict"

import { IGBPackage, GBMinInstance, IGBCoreService } from 'botlib'
import { Sequelize } from 'sequelize-typescript'
import { ADAudit } from './model/ADModel'

import { ADResetPasswordDialogs } from './dialog/ADResetPasswordDialogs'

export class Package implements IGBPackage {
  sysPackages: IGBPackage[]

  public getDialogs(min: GBMinInstance) {
    return [ADResetPasswordDialogs.getDialog(min)];
  }

  loadPackage(core: IGBCoreService, sequelize: Sequelize): void {
    sequelize.addModels([ADAudit])
  }

  unloadPackage(core: IGBCoreService): void {

  }

  loadBot(min: GBMinInstance): void {

  }

  unloadBot(min: GBMinInstance): void {

  }

  onNewSession(min: GBMinInstance, dc: any): void {

  }
}
