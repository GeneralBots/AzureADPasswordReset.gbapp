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
        async step=>{
          step.activeDialog.state.resetInfo = {};
          const locale = step.context.activity.locale;

          // Prompts for the guest's name.

          await step.context.sendActivity(Messages[locale].ok_get_information);
          await step.prompt("textPrompt", Messages[locale].whats_email);
        },
        async (step ) => {
          const email = step.result;
          const locale = step.context.activity.locale;

          const extractEmails = (text) => {
            return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
          }

          step.activeDialog.state.resetInfo.email = extractEmails(email)[0];

          // Prompts for the guest's mobile number.

          await step.prompt("textPrompt", Messages[locale].whats_mobile);
        },
        async (step) => {
          const mobile = step.result;
          const locale = step.context.activity.locale;
          step.activeDialog.state.resetInfo.mobile = mobile;

          step.activeDialog.state.resetInfo.adminToken =
            await min.adminService.acquireElevatedToken(min.instance.instanceId)
          let savedMobile =
            await ADService.getUserMobile(step.activeDialog.state.resetInfo.adminToken,
              step.activeDialog.state.resetInfo.email
            );

          if (savedMobile != mobile) {
            throw new Error('invalid number')
          }

          // Generates a new mobile code.

          let code = ADService.getNewMobileCode();
          step.activeDialog.state.resetInfo.sentCode = code;

          // Sends a confirmation SMS.

          await min.conversationalService['sendSms'](min,
            mobile,
            Messages[locale].please_use_code(code)
          );
          await step.context.sendActivity(Messages[locale].confirm_mobile);
        },
        async (step) => {
          const typestepode = step.result;
          const locale = step.context.activity.locale;

          // Checks if the typed code is equal to the one
          // sent to the registered mobile.

          if (typestepode == step.activeDialog.state.resetInfo.sentCode) {
            let password = ADService.getRndPassProfile();

            await ADService.resetADPassProfile2(step.activeDialog.state.resetInfo.adminToken,
              step.activeDialog.state.resetInfo.email,
              password
            );

            await step.context.sendActivity(
              Messages[locale].new_password(password)
            );

            await step.replace("/ask", { isReturning: true })
          }
        }
      ]
    }
  }
}
