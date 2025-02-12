export type DataTestidOptions = {
  filepath: string;
  filename: string;
  isRoot: boolean;
  className?: string;
  classNames?: string[];
}

export type buildDataTestid = (options: DataTestidOptions) => string | undefined

export type IgnoreNode = (
  nodeName: string,
  options: DataTestidOptions
) => boolean

export type PluginOptions = {
  buildDataTestid: buildDataTestid;
  ignoreNode?: IgnoreNode
}
