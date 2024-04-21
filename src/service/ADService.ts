/*****************************************************************************\
|                                               ( )_  _                       |
|    _ _    _ __   _ _    __    ___ ___     _ _ | ,_)(_)  ___   ___     _     |
|   ( '_`\ ( '__)/'_` ) /'_ `\/' _ ` _ `\ /'_` )| |  | |/',__)/' _ `\ /'_`\   |
|   | (_) )| |  ( (_| |( (_) || ( ) ( ) |( (_| || |_ | |\__, \| ( ) |( (_) )  |
|   | ,__/'(_)  `\__,_)`\__  |(_) (_) (_)`\__,_)`\__)(_)(____/(_) (_)`\___/'  |
|   | |                ( )_) |                                                |
|   (_)                 \___/'                                                |
|                                                                             |
|    Copyright 2018-2019 (c) pragmatismo.cloud. Todos os direitos reservados.    |
|                                                                             |
\*****************************************************************************/

"use strict"

import { ADAudit } from "../model/ADModel"
var AuthenticationContext = require('adal-node').AuthenticationContext;

const PasswordGenerator = require("strict-password-generator").default;
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

export class ADService {
  async getAuditLog():
    Promise<ADAudit[]> {
    return ADAudit.findAll()
  }


  public static async getUserMobile(token: string, email: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let client = MicrosoftGraph.Client.init({
        authProvider: done => {
          done(null, token);
        }
      });
      client.api(`/users/${email}`).get((err, res) => {
        if (err) { reject(err) }
        else { resolve(res.mobilePhone); }
      });
    });
  }

  public static async resetADPassProfile(token: string, email: string, passProfile: string) {
    return new Promise<string>((resolve, reject) => {
      let client = MicrosoftGraph.Client.init({
        authProvider: done => {
          done(null, token);
        }
      });
      const account = {
        accountEnabled: true,
        passwordProfile: {
          password: passProfile,
          forceChangePasswordNextSignIn: "true"
        }
      };

      client.api(`/users/${email}`).patch(account, (err, res) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(res);
        }
      });
    });
  }
  public static async resetADPassProfile2(token: string, email: string, passProfile: string) {
    return new Promise<string>((resolve, reject) => {
      let client = MicrosoftGraph.Client.init({
        authProvider: done => {
          done(null, token);
        }
      });
      const account = {
        newPassword: passProfile,
        forceChangePasswordNextSignIn: "true"
      };

      client.api(`/users/${email}/authentication/passwordMethods/28c10230-6103-485e-b985-444c60001490/resetPassword`)
        .post(account, (err, res) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(res);
        }
      });
    });
  }

  public static getRndPassProfile() {
    const passwordGenerator = new PasswordGenerator();
    const options = {
      upperCaseAlpha: true,
      lowerCaseAlpha: true,
      number: true,
      specialCharacter: true,
      minimumLength: 8,
      maximumLength: 8
    };
    let password = passwordGenerator.generatePassword(options);
    return password;
  }

  public static getNewMobileCode() {
    const passwordGenerator = new PasswordGenerator();
    const options = {
      upperCaseAlpha: false,
      lowerCaseAlpha: false,
      number: true,
      specialCharacter: false,
      minimumLength: 4,
      maximumLength: 4
    };
    let code = passwordGenerator.generatePassword(options);
    return code;
  }

}
