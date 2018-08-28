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

import * as Util from "util";
import { IGBDialog, GBMinInstance } from "botlib";
import { ADService } from "../service/ADService";
import { MessageFactory, BotAdapter } from "botbuilder";

const Fs = require("fs");
const WaitUntil = require("wait-until");
const output = require("d3node-output");
const D3Node = require("d3-node");

export class ADResetPasswordDialogs extends IGBDialog {
  static setup(bot: BotAdapter, min: GBMinInstance) {

    min.dialogs.add("/Security_ResetPassword", [
      async (dc, args) => {
        let text = ["Please, what's your e-mail address?", "Please, tell me: What's your e-mail address?"];
        await dc.prompt('textPrompt', text[0]);
      },
      async (dc, value) => {

        const user = min.userState.get(dc.context);
        let code = value.trim(); // TODO: Migrate to middleware.
        console.log(`Trying to login with: ${code}`);

        let service = new ADService();
        service.getAuditLog(() => {
          dc.context.sendActivity(
            `Oi!`
          );
        });
      }
    ]);
  }
}
