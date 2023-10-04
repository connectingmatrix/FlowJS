import { runFlow } from '@flow/core'
import {
  type FlowInterface,
  type FlowPipes,
  type PipePromise,
  FlowTarget,
} from '@flow/definitions'

import { addPipe } from '@flow/methods'

export class Flow implements FlowInterface {
  pipes: FlowPipes = {
    init: [],
    events: [],
    targets: [],
  }

  flowRunning: boolean = false

  promisified: PipePromise = {
    isPromised: false,
    resolve: () => {},
    reject: () => {},
  }


  init = function(target: FlowTarget): Flow {
    // If target is a class or initializer of some kind.
    return addPipe.call(this, 'init', target, Array.from(arguments).slice(1))
  };

  to = function(target: FlowTarget): Flow {
    return addPipe.call(this, 'to', target, Array.from(arguments).slice(1))
  };

  from = function(target: FlowTarget): Flow {
    // Spawn a new Flow (if needed), because its a new Event Source.
    return addPipe.call(this, 'from', target, Array.from(arguments).slice(1))
  };

  run = function(): void | Promise<any> {
    if (this.promisified.isPromised)
      return new Promise((resolve, reject) => {
        this.promisified.resolve = resolve
        this.promisified.reject = reject
        runFlow.call(this)
      })
    else
      runFlow.call(this)
  };

  waitFor = function(target: FlowTarget): Flow {
    // waitFor will accept a conditional and value (using a proxy) or function
    // waitFor will also accept a flow, and check if waitingForEvent = false
    return addPipe.call(this, 'waitFor', target, Array.from(arguments).slice(1))
  };

  promisify = (): Flow => {
    this.promisified.isPromised = true
    return this
  };


  static modules: { [key: string]: any } = {}
  modules: { [key: string]: any } = {}

  thread(): FlowInterface | any {
    return new Flow()
  }

  static use(name: string, module: any) {
    if (this.modules[name])
      throw new Error(name + ' collides with existing Flow module or property.')

    this.modules[name] = module
  }

  constructor() {
    //@ts-ignore
    this.modules = this.constructor.modules

    return new Proxy(this, {
      get: function(target, property) {
        if (Reflect.has(target, property))
          return Reflect.get(target, property)
        else if (Reflect.has(target.modules, property))
          //@ts-ignore  
          return target.modules[property]
      }
    }) as Flow
  }
}