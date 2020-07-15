import {Cache} from '../../utils/cache';


export class UserHasTask {


  public task: string;

  constructor(task) {
    this.task = task;


  }


  private get getUserTasks() {
    const tasks = Cache.get('USER_TASKS');
    if (tasks[0] === '*') {
      return true;
    }

    const userTasks = tasks.map((task) => {
      return task.name;
    });

    return userTasks;
  }

  public hasTask(task = null) {
    const userHasTasks = this.getUserTasks;
    const taskToCheck = task ? task : this.task;
    if (typeof  userHasTasks === 'object') {
      return this.getUserTasks.includes(taskToCheck);
    }
    return this.getUserTasks;
  }

  public userScreenActivities(activities: string[]): any[] {
    return activities.map((activity) => {
      return this.hasTask(activity) ? activity : '';
    }).map((a) => {
      return a.split('_')[0];
    })
  }


}


