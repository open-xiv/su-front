interface PersonInfo {
    name: string;
    email: string;
    avatarUrl: string;
    password: string;
    key: string;
}

interface SuMeta {
    base: number;
    total: number;
}

interface User {
    id: string;
    person: PersonInfo;
    meta: SuMeta;
    fightIds: string[];
    serverRecord: ServerRecord;
    token: string;
}

interface ServerRecord {
    ip: string,
    update: number
}

interface Instance {
    id: number;
    name: string;
    level: number;
}

interface Job {
    id: number;
    name: string;
    gauge: string;
}

interface Meta {
    instances: Instance[];
    jobs: Job[];
}

interface Oper {
    opCode: string;
    timestamp: number;
}

interface Area {
    op: Oper;
    instance: Instance;
}

interface Player {
    op: Oper;
    id: string;
    name: string;
    job: Job;
    level: number;
}

interface FightRecord {
    area: Area;
    players: Player[];
    pretty: boolean;
    useful: boolean;
}
