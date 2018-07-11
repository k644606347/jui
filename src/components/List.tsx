import * as React from 'react';
import { IListProps, ISectionData, IRowData } from './ListType';
import cssModules from './List.scss';
import Tools from '../utils/Tools';

export * from './ListType';
export default class List extends React.PureComponent<IListProps, any> {
    // public static defaultProps: IListProps = {
    //     dataSource: [''],
    //     renderRow: this.renderRow
    // };
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
            { dataSource, style, className, renderRow, renderSeparator } = props;

        return (<ul>{
            dataSource.map((dGroup: any) => {
                let result;
                
                if (Tools.isArray(dGroup)) {
                    result = this.renderSection(dGroup);
                } else if (Tools.isPlainObject(dGroup)) {
                    result = this.renderRow(dGroup);
                } else {
                    result = '';
                }

                return result;
            })
        }</ul>);
    }
    private renderSection(data: ISectionData) {
        let { renderSectionHeader, renderSectionBody, props } = this,
            { renderSectionWrapper } = props,
            header = renderSectionHeader(data),
            body = renderSectionBody(data);

        return renderSectionWrapper ? renderSectionWrapper(header, body) : <div>{header}{body}</div>;
    }
    private renderSectionHeader(data: ISectionData): JSX.Element {
        let { renderSectionHeader } = this.props;

        return renderSectionHeader ? renderSectionHeader(data) : <React.Fragment />;
    }
    private renderSectionBody(data: ISectionData) {
        let { renderSectionBodyWrapper } = this.props,
            { renderRow, renderSeparator } = this,
            children = data.data.map((d, i) => {
                return <React.Fragment key={i}>{ renderRow(d) }{ renderSeparator(d) }</React.Fragment>
            });

        return renderSectionBodyWrapper ? renderSectionBodyWrapper(children) : <div className={cssModules['section-body']}>{ children }</div>;
    }
    private renderRow(data: IRowData) {
        let { renderRow } = this.props;

        return <div>{ renderRow(data) }</div>;
    }
    private renderSeparator(data: IRowData) {
        let { renderSeparator } = this.props;

        return renderSeparator ? renderSeparator(data) : <div className={cssModules.separator} />;
    }
}