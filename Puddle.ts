
/*
 * Copyright 2020 Trevor Manley
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {IPuddleApp} from "puddle-interfaces/IPuddleApp"
import { IPuddleConfiguration } from "puddle-interfaces/IPuddleConfiguration";
import { IPuddleMessageQueue } from "puddle-interfaces/IPuddleMessageQueue";
import { IPuddleDataStore } from "puddle-interfaces/IPuddleDataStore";
import { IPuddleMessageHandler } from "puddle-interfaces/IPuddleMessageHandler";
import { IPuddleMessage } from "puddle-interfaces/IPuddleMessage";
import { IPuddleMessageConfiguration } from "puddle-interfaces/IPuddleMessageConfiguration";

export class Puddle implements IPuddleApp {
    configuration: IPuddleConfiguration;
    messageQueue: IPuddleMessageQueue;
    dataStore: IPuddleDataStore;
    messageHandlers: IPuddleMessageHandler[] = [];
    private messageTypes : IPuddleMessageConfiguration[] = [];
    constructor(config : IPuddleConfiguration){
        this.configuration = config;
        this.loadMessagesFromConfiguration()
    }
    getVersion(): string {
        return "1.0.0.0";
    }
    private loadMessagesFromConfiguration() : void {
        this.messageTypes = this.configuration.PuddleCore.messages
    }
    beginListening(): void {
        this.messageQueue.receiveMessage((msg : IPuddleMessage) => {
            // Find all handlers for the message type and run them
            // For more distinct/risky processing, make more types
            let handlers = this.messageHandlers.filter(handler => handler.messageType === msg.messageType);
            handlers.forEach(handler => handler.handle(this,msg));
            // Find the next message type and send out a message for it
            let nextMessageType = this.messageTypes.find(message => message.messageType === msg.next)
            if(!(nextMessageType === null || nextMessageType === undefined)){
                this.messageQueue.sendMessage({
                    messageType : msg.next,
                    object : msg.object,
                    next: nextMessageType.next
                });
            }
        });
    }

}