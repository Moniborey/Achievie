export interface task {
    _id: string,
    userID: string,
    task: string,
    priority: priority,
    isChecked:boolean,
    description: string,
    dueDate: Date,
    list?: {
      _id:any
      name: string,
      color: string
    },
    createdAt: Date,
    updatedAt: Date,
    __v: Number
}

export interface list{
  _id:any,
  userID:string,
  name:string,
  color:string,
  tasks?:task[],
  tasksCount?:number
  createdAt: Date,
}

export interface NavList{
  id: string;
  listName: string;
  listColor: string;
  taskcount: string;
}

export type priority = 'P1' | 'P2' | 'P3' | 'P4'