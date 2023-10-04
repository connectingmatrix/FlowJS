import { type FlowInterface, type FlowPipes, type PipePromise, FlowTarget } from '@flow/definitions';
export declare class Flow implements FlowInterface {
    pipes: FlowPipes;
    flowRunning: boolean;
    promisified: PipePromise;
    init: (target: FlowTarget) => Flow;
    to: (target: FlowTarget) => Flow;
    from: (target: FlowTarget) => Flow;
    run: () => void | Promise<any>;
    waitFor: (target: FlowTarget) => Flow;
    promisify: () => Flow;
    static modules: {
        [key: string]: any;
    };
    modules: {
        [key: string]: any;
    };
    thread(): FlowInterface | any;
    static use(name: string, module: any): void;
    constructor();
}
