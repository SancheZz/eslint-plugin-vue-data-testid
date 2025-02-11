export type buildDataTestid = (options: {
  filename: string;
  isRoot: boolean;
  className: string;
  classNames: string[];
}) => string | undefined

export type IgnoreNode = (nodeName: string) => boolean

export type PluginOptions = {
  buildDataTestid: buildDataTestid;
  ignoreNode?: IgnoreNode
}
