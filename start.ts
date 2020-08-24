/*
 * Copyright 2020 Trevor Manley
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as PuddleConf from "./_PuddleConfig";
import {Puddle} from "./Puddle";

let currentPuddle = new Puddle(configuration);
PuddleConf.SetupPuddle(currentPuddle);
PuddleConf.ApplyPlugins(currentPuddle);

console.log(`Puddle Version       - ${currentPuddle.getVersion()}`);
console.log(`Puddle Message Queue - ${currentPuddle.messageQueue.name}`);
console.log(`Puddle Data Store    - ${currentPuddle.dataStore.name}`);
console.log(`Message Handlers     - ${currentPuddle.messageHandlers.length}`);
console.log(`Initialize Delay     - ${currentPuddle.configuration.PuddleCore.StartupDelay} seconds`);
setTimeout(() => {
    currentPuddle.beginListening();
    console.log("Puddle Initialized!")
}, (currentPuddle.configuration.PuddleCore.StartupDelay * 1000));