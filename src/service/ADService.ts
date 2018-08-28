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
|                                                                             |
\*****************************************************************************/

"use strict";

import { Sequelize } from "sequelize-typescript";
import { fn } from "sequelize";
import { Promise } from "bluebird";

import { ADAudit } from "../model/ADModel";
import { GBServiceCallback } from 'botlib';

const Path = require("path");
const Fs = require("fs");
const _ = require("lodash");
const Parse = require("csv-parse");
const Async = require("async");
const UrlJoin = require("url-join");
const Walk = require("fs-walk");
const logger = require("winston");

export class ADService {
  getAuditLog(
    cb: GBServiceCallback<ADAudit[]>
  ) {

    ADAudit.findAll()
      .then((values: ADAudit[]) => {
        cb(values, null);
      })
      .error(reason => {
        cb(null, reason);
      });
  }
}
