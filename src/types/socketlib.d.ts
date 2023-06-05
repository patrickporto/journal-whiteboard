declare class SocketModule {
    register(name, func): void
    executeForOthers(name, ...args): void
}

declare class SocketLib {
    registerModule(name: string): SocketModule;
}

declare const socketlib: SocketLib;
