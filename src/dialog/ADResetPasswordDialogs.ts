/*****************************************************************************\
|                                               ( )_  _                       |
|    _ _    _ __   _ _    __    ___ ___     _ _ | ,_)(_)  ___   ___     _     |
|   ( '_`\ ( '__)/'_` ) /'_ `\/' _ ` _ `\ /'_` )| |  | |/',__)/' _ `\ /'_`\   |
|   | (_) )| |  ( (_| |( (_) || ( ) ( ) |( (_| || |_ | |\__, \| ( ) |( (_) )  |
|   | ,__/'(_)  `\__,_)`\__  |(_) (_) (_)`\__,_)`\__)(_)(____/(_) (_)`\___/'  |
|   | |                ( )_) |                                                |
|   (_)                 \___/'                                                |
|                                                                             |
|    Copyright 2018 (c) pragmatismo.io. Todos os direitos reservados.         |
\*****************************************************************************/

"use strict";

import { IGBDialog, GBMinInstance } from "botlib";
import { ADService } from "../service/ADService";
import { BotAdapter } from "botbuilder";
import { createOAuthPrompt } from "botbuilder-prompts";
import { Messages } from "../strings";

const Nexmo = require("nexmo");
const PasswordGenerator = require("strict-password-generator").default;
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

export class ADResetPasswordDialogs extends IGBDialog {
  static token = "";
  static tenantName = "";
  static apiKey = 0;
  static apiSecret = "";
  static serviceNumber = "";

  /**
   * Setup dialogs flows and define services call.
   *
   * @param bot The bot adapter.
   * @param min The minimal bot instance data.
   */
  static setup(bot: BotAdapter, min: GBMinInstance) {
    min.dialogs.add("/Admin_UpdateToken", [async (dc, args, next) => {}]);

    min.dialogs.add("/Security_ResetPassword", [
      async (dc, args, next) => {
        const locale = dc.context.activity.locale;
        await dc.Context.SendActivity(Messages[locale].ok_get_information);

        // Prompt for the guest's name.

        await dc.Prompt("textPrompt", Messages[locale].whats_name);
      },
      async (dc, args, next) => {
        const locale = dc.context.activity.locale;
        const name = args["Text"];
        const user = min.userState.get(dc.context);
        user.resetName = name;

        // Prompt for the guest's mobile number.

        await dc.Prompt("textPrompt", Messages[locale].whats_mobile);
      },
      async (dc, args, next) => {
        const locale = dc.context.activity.locale;
        const mobile = args["Text"];
        const user = min.userState.get(dc.context);
        user.resetMobile = mobile;

        let code = ADResetPasswordDialogs.getNewMobileCode();
        ADResetPasswordDialogs.sendConfirmationSms(locale, code);
        await dc.context.sendActivity(Messages[locale].confirm_mobile);
      },
      async (dc, value) => {
        const user = min.userState.get(dc.context);
        const locale = dc.context.activity.locale;

        let password = ADResetPasswordDialogs.getRndPassProfile();
        ADResetPasswordDialogs.resetADPassProfile(password);
        await dc.context.sendActivity(Messages[locale].new_password);
      }
    ]);

    // TODO: See issue 970 https://github.com/Microsoft/BotFramework-WebChat/issues/970
    const oauthPrompt = createOAuthPrompt({
      text: "Please sign in",
      title: "Sign in",
      connectionName: `https://login.microsoftonline.com/${
        ADResetPasswordDialogs.tenantName
      }/oauth2/authorize`
    });
  }

  private static resetADPassProfile(password: any) {
    let client = MicrosoftGraph.Client.init({
      authProvider: done => {
        const account = {
          accountEnabled: true,
          passwordProfile: {
            password: password,
            forceChangePasswordNextSignIn: "true"
          }
        };
        client.api("/users/test1@pragmatismo.io").patch(account, (err, res) => {
          console.log(res);
        });

        done(null, ADResetPasswordDialogs.token);
      }
    });
  }

  private static getRndPassProfile() {
    const passwordGenerator = new PasswordGenerator();
    const options = {
      upperCaseAlpha: false,
      lowerCaseAlpha: true,
      number: true,
      specialCharacter: false,
      minimumLength: 10,
      maximumLength: 12
    };
    let password = passwordGenerator.generatePassword(options);
    return password;
  }

  private static sendConfirmationSms(locale: any, code: any) {
    const nexmo = new Nexmo({
      apiKey: ADResetPasswordDialogs.apiKey,
      apiSecret: ADResetPasswordDialogs.apiSecret
    });
    nexmo.message.sendSms(
      ADResetPasswordDialogs.serviceNumber,
      ADResetPasswordDialogs.serviceNumber,
      Messages[locale].please_use_code(code)
    );
  }

  private static getNewMobileCode() {
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
