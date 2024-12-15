export enum CompleteHookType {
  SENDMESSAGE = "sendmessage",
}

export interface PartHook {
  part_id: number;
  total_parts: number;
  part_queue: string;
}

export interface CompleteHookArgument {
  id?: string;
  method?: string;
  inputs?: any;
}

export interface OnCompleteHook {
  type: CompleteHookType;
  route: string;
  method: string;
  inputs?: CompleteHookArgument;
}

export interface Hooks {
  on_complete?: OnCompleteHook[];
  part?: PartHook;
}
