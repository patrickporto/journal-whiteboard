declare class SocketModule {
    register(name: name, func: (...parameters: any[]) => any): void;
    executeForOthers(name: string, ...parameters: any[]): void;
    executeAsGM(name: string, ...parameters: any[]): Promise<any>;
    executeForEveryone(name: string, ...parameters: any[]): void;
}

declare class SocketLib {
    registerModule(name: string): SocketModule;
}

declare const socketlib: SocketLib;
