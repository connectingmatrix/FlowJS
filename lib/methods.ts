import {
  type FlowInterface,
  type FlowDirection,
  type FlowPipe,
  type FlowTarget,
} from '@flow/definitions'

import { isPrimitive } from '@flow/helpers'

export function isConstructor(f) {
  try {
    Reflect.construct(String, [], f);
    return true
  } catch (e) {
    return false
  }
}

// Pipe control
export function addPipe(direction: FlowDirection, target: FlowTarget, params: Array<any>): FlowInterface {
  const pipe: FlowPipe = {
    direction,
    target,
    params,
  }

  // Wrap any targets that are primitives with arrow function
  if (typeof target !== 'function') // Because functions are also objects
    if (isPrimitive(target))
      pipe.target = async () => target

  // Wrap any targets that are Promises with arrow function.
  //@ts-ignore
  if (typeof target === 'object' && typeof target.then === 'function') {
    //@ts-ignore
    pipe.target = (cb) => target.then(cb)
  }

  const flow = this
  switch (pipe.direction) {
    case 'init':
      if (!isConstructor(target))
        throw new Error('Flow target is not a constructor!')

      //console.log('init added for:', pipe)
      //flow.pipes.init.push(pipe)
      //@ts-ignore
      const instance = new target(...params)
      flow.pipes.init.push(instance)

      break

    case 'from':
      console.log('from added for:', pipe)
      flow.pipes.events.push(pipe)
      break

    case 'to':
      flow.pipes.targets.push(pipe)
      break

    default:
      // Shouldn't be here.
      console.warn('WARNING: Flow has received an unknown pipe direction. Please post a bug to the author about this.')
      break
  }

  console.log(`Added .${direction}(${target.name || 'anonymous'})`)
  return this
}