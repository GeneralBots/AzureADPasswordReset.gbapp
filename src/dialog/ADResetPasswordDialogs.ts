/*****************************************************************************\
|                                               ( )_  _                       |
|    _ _    _ __   _ _    __    ___ ___     _ _ | ,_)(_)  ___   ___     _     |
|   ( '_`\ ( '__)/'_` ) /'_ `\/' _ ` _ `\ /'_` )| |  | |/',__)/' _ `\ /'_`\   |
|   | (_) )| |  ( (_| |( (_) || ( ) ( ) |( (_| || |_ | |\__, \| (M) |( (_) )  |
|   | ,__/'(_)  `\__,_)`\__  |(_) (_) (_)`\__,_)`\__)(_)(____/(_) (_)`\___/'  |
|   | |                ( )_) |                                                |
|   (_)                 \___/'                                                |
|                                                                             |
|    Copyright 2018-2019 (c) pragmatismo.io. Todos os direitos reservados.    |
\*****************************************************************************/

"use strict";

import { IGBDialog, GBMinInstance } from "botlib";
import { Messages } from "../strings";
import { ADService } from "../service/ADService";

export class ADResetPasswordDialogs extends IGBDialog {

  /**
   * Setup dialogs flows and define services call.
   * @param min The minimal bot instance data.
   */
  static getDialog(min: GBMinInstance) {

    return {
      id: '/Security_ResetPassword', waterfall: [
        async dc => {
          dc.activeDialog.state.resetInfo = {};
          const locale = dc.context.activity.locale;

          // Prompts for the guest's name.

          await dc.context.sendActivity(Messages[locale].ok_get_information);
          await dc.prompt("textPrompt", Messages[locale].whats_email);
        },
        async (dc, email) => {
          const locale = dc.context.activity.locale;

          const extractEmails = (text) => {
            return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
          }

          dc.activeDialog.state.resetInfo.email = extractEmails(email)[0];

          // Prompts for the guest's mobile number.

          await dc.prompt("textPrompt", Messages[locale].whats_mobile);
        },
        async (dc, mobile) => {
          const locale = dc.context.activity.locale;
          dc.activeDialog.state.resetInfo.mobile = mobile;

          dc.activeDialog.state.resetInfo.adminToken =
            await min.adminService.acquireElevatedToken(min.instance.instanceId)
          let savedMobile =
            await ADService.getUserMobile(dc.activeDialog.state.resetInfo.adminToken,
              dc.activeDialog.state.resetInfo.email
            );

          if (savedMobile != mobile) {
            dc.endAll();
            throw new Error('invalid number')
          }

          // Generates a new mobile code.

          let code = ADService.getNewMobileCode();
          dc.activeDialog.state.resetInfo.sentCode = code;

          // Sends a confirmation SMS.

          await min.conversationalService['sendSms'](min,
            mobile,
            Messages[locale].please_use_code(code)
          );
          await dc.context.sendActivity(Messages[locale].confirm_mobile);
        },
        async (dc, typedCode) => {
          const locale = dc.context.activity.locale;

          // Checks if the typed code is equal to the one
          // sent to the registered mobile.

          if (typedCode == dc.activeDialog.state.resetInfo.sentCode) {
            let password = ADService.getRndPassProfile();

            await ADService.resetADPassProfile(dc.activeDialog.state.resetInfo.adminToken,
              dc.activeDialog.state.resetInfo.email,
              password
            );

            await dc.context.sendActivity(
              Messages[locale].new_password(password)
            );

            await dc.replace("/ask", { isReturning: true })
          }
        }
      ]
    }
  }
}
