// export interface IList {
//   renderRow: (data: object) => JSX.Element;
//   renderSectionWrapper: (header: JSX.Element, body: JSX.Element) => JSX.Element;
//   renderSectionHeader: () => JSX.Element;
//   renderSectionBodyWrapper: () => JSX.Element;
//   renderSeparator: () => JSX.Element;
// }
export interface ISectionData {
  type: 'section';
  title?: string;
  data: IRowData[];
}
export interface IRowData {
  type: 'row';
  data: any;
}
export interface IListProps {
  dataSource: Array<ISectionData | IRowData | never>;
  style?: React.CSSProperties;
  className?: string;
  sectionHeaderSticky?: boolean;
  renderRow: (data: IRowData) => JSX.Element;
  renderSeparator?: (data: IRowData) => JSX.Element;
  // renderSectionWrapper?: (header: JSX.Element, body: JSX.Element) => JSX.Element;
  renderSectionHeader?: (data: ISectionData) => JSX.Element;
  renderSectionBodyWrapper?: (...child: JSX.Element[][]) => JSX.Element;
}