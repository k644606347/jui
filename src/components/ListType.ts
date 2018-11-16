// export interface IList {
//   renderRow: (data: object) => JSX.Element;
//   renderSectionWrapper: (header: JSX.Element, body: JSX.Element) => JSX.Element;
//   renderSectionHeader: () => JSX.Element;
//   renderSectionBodyWrapper: () => JSX.Element;
//   renderSeparator: () => JSX.Element;
// }
export interface SectionData {
  type: 'section';
  title?: string;
  data: RowData[];
}
export interface RowData {
  [k: string]: any;
}
export interface IListProps {
  dataSource: Array<SectionData | RowData | any>;
  style?: React.CSSProperties;
  className?: string;
  sectionHeaderSticky?: boolean;
  renderRow: (data: RowData | any) => JSX.Element;
  renderSeparator?: (data: RowData) => JSX.Element;
  // renderSectionWrapper?: (header: JSX.Element, body: JSX.Element) => JSX.Element;
  renderSectionHeader?: (data: SectionData) => JSX.Element;
  renderSectionBodyWrapper?: (...child: JSX.Element[][]) => JSX.Element;
}