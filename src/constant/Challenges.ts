export enum CHALLENGES {
    TIME = 'time',
    SCORE = 'score',
    BOUNCE = 'bounce',
    NO_AIM = 'no-aim',
}

export const CHALLENGES_CONFIG = {
    time: {
        color: 0x00bdff,
        levels: 3,
        description: '',
    },
    score: {
        color: 0x37d133,
        levels: 0,
        description: '',
    },
    bounce: {
        color: 0xf863fc,
        levels: 0,
        description: '',
    },
    'no-aim': {
        color: 0xff766c,
        levels: 3,
        description: 'Complete with no aim',
    },
}
