export type DataTestidOptions = {
  nodeName: string;
  filepath: string;
  filename: string;
  isRoot: boolean;
  className?: string;
  classNames?: string[];
}

export type BuildDataTestid = (options: DataTestidOptions) => string | undefined
export type IgnoreNode = (options: DataTestidOptions) => boolean

export type PluginOptions = {
  buildDataTestid: BuildDataTestid;
  ignoreNode?: IgnoreNode
}
