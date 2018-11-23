import * as React from 'react';
import { IListProps, SectionData, RowData } from './ListType';
import Tools from '../utils/Tools';
import listCSS from './List.scss';

export * from './ListType';

const tools = Tools.getInstance();
export default class List extends React.PureComponent<IListProps, any> {
    public static defaultProps: IListProps = {
        dataSource: [],
        renderRow: (data) => <React.Fragment>{ JSON.stringify(data) }</React.Fragment>,
        sectionHeaderSticky: true,
    };
    constructor(props: IListProps) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderSection = this.renderSection.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSectionBody = this.renderSectionBody.bind(this);
    }
    public render() {
        let { props } = this,
            { dataSource, style, className } = props;

        return (<ul style={style} className={tools.classNames(listCSS.list, className)}>{
            dataSource.map((dGroup: any, i) => {
                let result,
                    classNames = [listCSS.item];
                
                if (dGroup.type === 'section') {
                    result = this.renderSection(dGroup);
                    // classNames.push(cssModules['section-wrap']);
                } else {
                    result = <React.Fragment>{this.renderRow(dGroup)}</React.Fragment>;
                }

                return <li className={tools.classNames(classNames)} key={i}>{ result }</li>;
            })
        }</ul>);
    }
    private renderSection(data: SectionData) {
        let { renderSectionHeader, renderSectionBody } = this,
            // { renderSectionWrapper } = props,
            headerEl = renderSectionHeader(data),
            bodyEl = renderSectionBody(data);

        return <div className={listCSS.section}>{headerEl}{bodyEl}</div>;

        // return renderSectionWrapper ? renderSectionWrapper(headerEl, bodyEl) : <div className={cssModules.section}>{headerEl}{bodyEl}</div>;
    }
    private renderSectionHeader(data: SectionData): JSX.Element {
        let { renderSectionHeader, sectionHeaderSticky } = this.props,
            headerContent = renderSectionHeader ? renderSectionHeader(data) : data.title,
            classNames = tools.classNames(listCSS.sectionHeader, sectionHeaderSticky && listCSS.sectionHeaderSticky);

        return headerContent ? <div className={tools.classNames(classNames)}>{ headerContent }</div> : <React.Fragment />;
    }
    private renderSectionBody(data: SectionData) {
        let { renderSectionBodyWrapper } = this.props,
            { renderRow, renderSeparator } = this,
            children = data.data.map((d, i) => {
                return <React.Fragment key={i}>{ renderRow(d) }</React.Fragment>
            });

        return <div className={listCSS.sectionBody}>{ renderSectionBodyWrapper ? renderSectionBodyWrapper(children) : children }</div>;
    }
    private renderRow(data: RowData) {
        let { renderRow } = this.props;

        return <div className={ listCSS.row }>{ renderRow(data) }</div>
    }
    private renderSeparator(data: RowData) {
        let { renderSeparator } = this.props,
            className = listCSS['row-separator'];

        return renderSeparator ? renderSeparator(data) : <div className={className} />;
    }
}