declare class SocketModule {
    register(name, func): void
    executeForOthers(name, ...args): Promise<any>
}

declare class SocketLib {
    registerModule(name: string): SocketModule;
}

declare const socketlib: SocketLib;
