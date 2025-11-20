type MissionState = 'IDLE' | 'PLANNING' | 'EXECUTING' | 'DONE';

export class MissionManager {
    private mission: string | null = null;
    private plan: string[] = [];
    private completedTasks: string[] = [];
    private state: MissionState = 'IDLE';
    constructor() {}

    setMission(mission: string): void {
        this.mission = mission;
        this.plan = [];
        this.completedTasks = [];
        this.state = 'PLANNING';
    }

    getMission(): string | null {
        return this.mission;
    }

    completeMission(): void {
        this.state = 'DONE';
    }

    setPlan(steps: string[]): void {
        this.plan = steps;
        this.completedTasks = [];
        this.state = 'EXECUTING';
    }

    getCurrentTask(): string | null {
        if (this.state !== 'EXECUTING' || this.plan.length === 0) {
            return null;
        }
        return this.plan[0] ?? null;
    }

    completeCurrentTask(): void {
        if (this.state === 'EXECUTING' && this.plan.length > 0) {
            const completed = this.plan.shift();
            if (completed) {
                this.completedTasks.push(completed);
            }
        }
        if (this.plan.length === 0 && this.state === 'EXECUTING') {
            this.state = 'PLANNING'; // Go back to planning when the current plan is done
        }
    }

    getState(): MissionState {
        return this.state;
    }

    getStatus(): string {
        if (this.state === 'IDLE') {
            return "I am idle. I have no mission.";
        }
        if (this.state === 'DONE') {
            return `Mission "${this.mission}" is complete.`;
        }

        const status = [
            `Mission: "${this.mission}"`, 
            `State: ${this.state}`,
        ];

        if (this.completedTasks.length > 0) {
            status.push(`Completed Tasks: ${this.completedTasks.join(', ')}`);
        }

        const currentTask = this.getCurrentTask();
        if (currentTask) {
            status.push(`Current Task: ${currentTask}`);
        } else if (this.state === 'EXECUTING') {
            status.push('Plan is complete. Ready for a new plan.');
        }

        if (this.plan.length > 1) {
            const upcomingTasks = this.plan.slice(1);
            status.push(`Upcoming Tasks: ${upcomingTasks.join(', ')}`);
        }

        return status.join('\n');
    }
}
