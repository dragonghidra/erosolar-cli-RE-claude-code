import type { ToolDefinition } from '../core/toolRuntime.js';
import type { MissionManager } from '../core/missionManager.js';

interface MissionToolOptions {
  missionManager: MissionManager;
}

export function createMissionTools(options: MissionToolOptions): ToolDefinition[] {
  const { missionManager } = options;

  return [
    {
      name: 'SetMission',
      description: 'Sets the agent\'s high-level objective or "mission". This will begin the autonomous execution loop.',
      parameters: {
        type: 'object',
        properties: {
          mission: {
            type: 'string',
            description: 'A clear and concise description of the overall mission.',
          },
        },
        required: ['mission'],
      },
      handler: async (args) => {
        const mission = args['mission'];
        if (typeof mission !== 'string' || !mission.trim()) {
          return 'Error: mission must be a non-empty string.';
        }
        missionManager.setMission(mission);
        return `Mission set: "${mission}". I will now create a plan to achieve this.`;
      },
    },
    {
        name: 'GetMission',
        description: 'Retrieves the current mission and the status of the plan.',
        parameters: {
            type: 'object',
            properties: {},
        },
        handler: async () => {
            return missionManager.getStatus();
        },
    },
    {
      name: 'CompleteMission',
      description: 'Declares the overall mission as complete.',
      parameters: {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description: 'A summary of how the mission was accomplished.',
          },
        },
        required: ['summary'],
      },
      handler: async (args) => {
        const summary = args['summary'];
        if (typeof summary !== 'string' || !summary.trim()) {
          return 'Error: summary must be a non-empty string.';
        }
        const mission = missionManager.getMission();
        missionManager.completeMission();
        return `Mission "${mission}" has been completed. Summary: ${summary}`;
      },
    },
    {
        name: 'CreatePlan',
        description: 'Creates a new plan to work towards the current mission.',
        parameters: {
            type: 'object',
            properties: {
                steps: {
                    type: 'array',
                    description: 'A list of tasks to be executed to achieve the mission.',
                    items: {
                        type: 'string',
                    },
                },
            },
            required: ['steps'],
        },
        handler: async (args) => {
            const steps = args['steps'];
            if (!Array.isArray(steps) || steps.some(s => typeof s !== 'string')) {
                return 'Error: steps must be an array of strings.';
            }
            missionManager.setPlan(steps);
            return `Plan created with ${steps.length} steps. Starting execution.`;
        },
    },
    {
        name: 'GetCurrentTask',
        description: 'Gets the current task from the plan.',
        parameters: {
            type: 'object',
            properties: {},
        },
        handler: async () => {
            const task = missionManager.getCurrentTask();
            return task ? `Current task: ${task}` : 'No active task. The plan is complete.';
        },
    },
    {
        name: 'CompleteTask',
        description: 'Marks the current task as complete.',
        parameters: {
            type: 'object',
            properties: {},
        },
        handler: async () => {
            const completedTask = missionManager.getCurrentTask();
            if (!completedTask) {
                return 'Error: No active task to complete.';
            }
            missionManager.completeCurrentTask();
            const nextTask = missionManager.getCurrentTask();
            let response = `Task "${completedTask}" completed.`;
            if (nextTask) {
                response += ` Next task is: "${nextTask}".`;
            } else {
                response += ' The plan is now complete. You should now create a new plan or complete the mission.';
            }
            return response;
        },
    },
  ];
}
