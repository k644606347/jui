import * as React from 'react';
import { IListProps, ISectionData, IRowData } from './ListType';
import cssModules from './List.scss';
import Tools from '../utils/Tools';

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
        let { props, state } = this,
            { dataSource, style, className } = props;

        return (<ul style={style} className={tools.classNames(cssModules.list, className)}>{
            dataSource.map((dGroup: any, i) => {
                let result,
                    classNames = [cssModules['list-item']];
                
                if (dGroup.type === 'section') {
                    result = this.renderSection(dGroup);
                    // classNames.push(cssModules['section-wrap']);
                } else if (dGroup.type === 'row') {
                    result = <React.Fragment>{this.renderRow(dGroup)}{this.renderSeparator(dGroup)}</React.Fragment>;
                    // classNames.push(cssModules['row-wrap']);
                } else {
                    result = '';
                }

                return <li className={tools.classNames(classNames)} key={i}>{ result }</li>;
            })
        }</ul>);
    }
    private renderSection(data: ISectionData) {
        let { renderSectionHeader, renderSectionBody, props } = this,
            // { renderSectionWrapper } = props,
            headerEl = renderSectionHeader(data),
            bodyEl = renderSectionBody(data);

        return <div className={cssModules.section}>{headerEl}{bodyEl}</div>;

        // return renderSectionWrapper ? renderSectionWrapper(headerEl, bodyEl) : <div className={cssModules.section}>{headerEl}{bodyEl}</div>;
    }
    private renderSectionHeader(data: ISectionData): JSX.Element {
        let { renderSectionHeader, sectionHeaderSticky } = this.props,
            headerContent = renderSectionHeader ? renderSectionHeader(data) : data.title,
            classNames = tools.classNames(cssModules['section-header'], sectionHeaderSticky && cssModules['section-header-sticky']);

        return headerContent ? <div className={tools.classNames(classNames)}>{ headerContent }</div> : <React.Fragment />;
    }
    private renderSectionBody(data: ISectionData) {
        let { renderSectionBodyWrapper } = this.props,
            { renderRow, renderSeparator } = this,
            children = data.data.map((d, i) => {
                return <React.Fragment key={i}>{ renderRow(d) }{ renderSeparator(d) }</React.Fragment>
            });

        return <div className={cssModules['section-body']}>{ renderSectionBodyWrapper ? renderSectionBodyWrapper(children) : children }</div>;
    }
    private renderRow(data: IRowData) {
        let { renderRow } = this.props;

        return <div className={ cssModules.row }>{ renderRow(data) }</div>
    }
    private renderSeparator(data: IRowData) {
        let { renderSeparator } = this.props,
            className = cssModules['row-separator'];

        return renderSeparator ? renderSeparator(data) : <div className={className} />;
    }
}