import * as React from 'react';
import { IListProps, SectionData, RowData } from './ListType';
import listCSS from './List.scss';
import { tools } from '../utils/Tools';
import View from './View';
tools.useCSS(listCSS);

export * from './ListType';
export default class List extends View<IListProps> {
    static defaultProps: IListProps = {
        dataSource: [],
        renderRow: (data) => <React.Fragment>{ JSON.stringify(data) }</React.Fragment>,
        sectionHeaderSticky: true,
    };
    cssObject = listCSS;
    constructor(props: IListProps) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
        this.renderSection = this.renderSection.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderSectionBody = this.renderSectionBody.bind(this);
    }
    render() {
        let { props } = this,
            { dataSource, style, className } = props,
            cssModules = this.cssModules;

        return (<ul style={style} className={tools.classNames(cssModules.list, className)}>{
            dataSource.map((dGroup: any, i) => {
                let result,
                    classNames = [cssModules.item];
                
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

        return <div className={this.cssModules.section}>{headerEl}{bodyEl}</div>;

        // return renderSectionWrapper ? renderSectionWrapper(headerEl, bodyEl) : <div className={cssModules.section}>{headerEl}{bodyEl}</div>;
    }
    private renderSectionHeader(data: SectionData): JSX.Element {
        let { renderSectionHeader, sectionHeaderSticky } = this.props,
            headerContent = renderSectionHeader ? renderSectionHeader(data) : data.title,
            cssModules = this.cssModules,
            classNames = tools.classNames(cssModules.sectionHeader, sectionHeaderSticky && cssModules.sectionHeaderSticky);

        return headerContent ? <div className={tools.classNames(classNames)}>{ headerContent }</div> : <React.Fragment />;
    }
    private renderSectionBody(data: SectionData) {
        let { renderSectionBodyWrapper } = this.props,
            { renderRow, renderSeparator } = this,
            cssModules = this.cssModules,
            children = data.data.map((d, i) => {
                return <React.Fragment key={i}>{ renderRow(d) }</React.Fragment>
            });

        return <div className={cssModules.sectionBody}>{ renderSectionBodyWrapper ? renderSectionBodyWrapper(children) : children }</div>;
    }
    private renderRow(data: RowData) {
        let { renderRow } = this.props,
            cssModules = this.cssModules;

        return <div className={ cssModules.row }>{ renderRow(data) }</div>
    }
    private renderSeparator(data: RowData) {
        let { renderSeparator } = this.props,
            cssModules = this.cssModules,
            className = cssModules.rowSeparator;

        return renderSeparator ? renderSeparator(data) : <div className={className} />;
    }
}