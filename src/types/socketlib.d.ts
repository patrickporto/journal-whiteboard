declare class SocketModule {
    register(name: name, func: (...args: any) => any): void
    executeForOthers(name: string, ...args): Promise<any>
    executeAsGM(name: string, ...parameters: any[]): Promise<any>;
}

declare class SocketLib {
    registerModule(name: string): SocketModule;
}

declare const socketlib: SocketLib;
