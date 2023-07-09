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
        description: 'Complete in [x] seconds',
    },
    score: {
        color: 0x37d133,
        levels: 3,
        description: 'Complete with score [x]',
    },
    bounce: {
        color: 0xf863fc,
        levels: 3,
        description: 'Complete with [x] bounces',
    },
    'no-aim': {
        color: 0xff766c,
        levels: 3,
        description: 'Complete with no aim',
    },
}
