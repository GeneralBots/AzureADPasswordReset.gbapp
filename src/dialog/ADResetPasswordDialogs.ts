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

const MicrosoftGraph = require("@microsoft/microsoft-graph-client");
const Fs = require("fs");
const WaitUntil = require("wait-until");
const output = require("d3node-output");
const D3Node = require("d3-node");

export class ADResetPasswordDialogs extends IGBDialog {
  static setup(bot: BotAdapter, min: GBMinInstance) {

    const token = "";

    min.dialogs.add("/Security_ResetPassword", [
      async (dc, args) => {

        var client = MicrosoftGraph.Client.init({
          authProvider: (done) => {
            // First parameter takes an error if you can't get an access token.
            done(null, token); 
          }
        })

        const user = {
          "accountEnabled": true,
          "passwordProfile": {
            "password":"changethis#1",
            "forceChangePasswordNextSignIn":"true"
          }
        }

        client
          .api('/users/test1@pragmatismo.io')
          .patch(user, (err, res) => {
            console.log(res)
          })

      },
      async (dc, value) => {
        const result = await oauthPrompt.recognize(dc.context);
        await dc.context.sendActivity("Your token is: " + result.token);
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

    const oauthPrompt = createOAuthPrompt({
      text: 'Please sign in',
      title: 'Sign in',
      connectionName: "https://login.microsoftonline.com/6ecb2a67-15af-4582-ab85-cc65096ce471/oauth2/authorize",
    });


    min.dialogs.add("/Security_ResetPassword2222", [
      async (dc, args) => {
        await oauthPrompt.prompt(dc.context);
      },
      async (dc, value) => {
        const result = await oauthPrompt.recognize(dc.context);
        await dc.context.sendActivity("Your token is: " + result.token);
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


// dc.context.sendActivity(
//   `OK, I will get some information.`
// );
// let text = ["Please, what's your e-mail address?", "Please, tell me: What's your e-mail address?"];
// await dc.prompt('textPrompt', text[0]);