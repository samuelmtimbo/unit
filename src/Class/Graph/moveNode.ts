import { Dict } from '../../types/Dict'
import { MoveMap, MoveTask } from './buildMoveMap'
import { Moves } from './buildMoves'

export const moveNode = (map: MoveMap, nodeId: string): Moves => {
  const { table, tasks } = map

  const moves: Moves = []

  const taskId = table[nodeId]

  if (!taskId) {
    return
  }

  const task = tasks[taskId]

  moves.push(...maybeExecuteTask(taskId, task, tasks))

  return moves
}

export const executeTask = (
  taskId: string,
  task: MoveTask,
  tasks: Dict<MoveTask>
): Moves => {
  const moves: Moves = []

  if (task.dependsOn.size === 0) {
    moves.push(...task.moves)

    for (const dependentTaskId of task.isDependencyOf) {
      const dependentTask = tasks[dependentTaskId]

      dependentTask.dependsOn.delete(taskId)

      moves.push(...maybeExecuteTask(dependentTaskId, dependentTask, tasks))
    }
  }

  return moves
}

export const maybeExecuteTask = (
  taskId: string,
  task: MoveTask,
  tasks: Dict<MoveTask>
): Moves => {
  if (task.dependsOn.size === 0) {
    return executeTask(taskId, task, tasks)
  }

  return []
}
