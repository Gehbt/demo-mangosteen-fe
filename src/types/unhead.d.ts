// TODO: add to ComponentCustomOptions(HARD)
declare module "DefineHeadType" {
  import { MergeHead, UseHeadInput } from "@unhead/vue";
  export type HeadType<T extends MergeHead = {}> = UseHeadInput<T>;
}
