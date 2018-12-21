"use strict";
cc._RF.push(module, '2e203tup99JJ5nSDvFuy7AM', 'SoundManager');
// Script/GameLogic/SoundManager.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            type: cc.AudioSource,
            default: null
        },
        btn_click: {
            url: cc.AudioClip,
            default: null
        },
        gamewin: {
            url: cc.AudioClip,
            default: null
        },
        done: {
            url: cc.AudioClip,
            default: null
        },
        error: {
            url: cc.AudioClip,
            default: null
        },
        clock: {
            url: cc.AudioClip,
            default: null
        },
        uplock: {
            url: cc.AudioClip,
            default: null
        },
        getCoin: {
            url: cc.AudioClip,
            default: null
        },
        isOpen: true,
        isVoiceOpen: true
    },

    // LIFE-CYCLE CALLBACKS: 

    playSound: function playSound(soundtype) {
        if (this.isOpen) {
            switch (soundtype) {
                case "btn_click":
                    cc.audioEngine.play(this.btn_click, false, 1);
                    break;
                case "done":
                    cc.audioEngine.play(this.done, false, 1);
                    break;
                case "error":
                    cc.audioEngine.play(this.error, false, 1);
                    break;
                case "clock":
                    cc.audioEngine.play(this.clock, false, 1);
                    break;
                case "gamewin":
                    cc.audioEngine.play(this.gamewin, false, 1);
                    break;
                case "uplock":
                    cc.audioEngine.play(this.uplock, false, 1);
                    break;
                case "getCoin":
                    cc.audioEngine.play(this.getCoin, false, 1);
                    break;
            }
        }
    },

    playBg: function playBg() {
        if (this.isOpen) {
            this.audioSource.play();
        }
    },

    setVoiceIsOpen: function setVoiceIsOpen(isOpen) {
        this.isVoiceOpen = isOpen;
        if (isOpen) {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(0);
                }
            } catch (e) {}
        } else {
            try {
                if (str != null) {
                    HiboGameJs.enableMic(1);
                }
            } catch (e) {}
        }
    },

    setIsOpen: function setIsOpen(isOpen) {
        this.isOpen = isOpen;
        if (this.isOpen) {
            this.playBg();
            try {
                if (str != null) {
                    HiboGameJs.mute(0);
                }
            } catch (e) {}
        } else {
            this.audioSource.pause();
            try {
                if (str != null) {
                    HiboGameJs.mute(1);
                }
            } catch (e) {}
        }
    }
});

cc._RF.pop();