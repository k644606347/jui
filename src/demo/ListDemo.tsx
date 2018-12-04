import * as React from "react";
import { List } from "../index";

export default () => <List dataSource={[
    {
        type: 'section',
        title: 'section1',
        data: [
            {
                type: 'row',
                data: {
                    id: 'baidu',
                    name: 'biaduche',
                }
            }
        ]
    },
    {
        type: 'section',
        title: 'section2',
        data: [
            {
                type: 'row',
                data: {
                    id: 'baidu',
                    name: 'biaduche',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
        ]
    },
    {
        type: 'section',
        title: 'section3',
        data: [
            {
                type: 'row',
                data: {
                    id: 'baidu',
                    name: 'biaduche',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
        ]
    },
    {

        type: 'section',
        title: 'section4',
        data: [
            {
                type: 'row',
                data: {
                    id: 'baidu',
                    name: 'biaduche',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
            {
                type: 'row',
                data: {
                    id: '123121312131',
                    name: 'liu1',
                }
            },
        ]
    },
    {
        type: 'row',
        data: {
            id: '123121312131',
            name: 'liu1',
        }
    },
    {
        type: 'row',
        data: {
            id: '123121312131',
            name: 'liu1',
        }
    },
    {
        type: 'row',
        data: {
            id: '123121312131',
            name: 'liu1',
        }
    },
    // tslint:disable-next-line:jsx-no-lambda
]} renderRow={(data) => {
    return <div style={{ padding: '5px', display: 'flex', flexDirection: 'row' }}><img src='sss' alt={'sd'} style={{ marginRight: '.5em' }} /><p>{`id = ${data.data.id}, name = ${data.data.name}`}</p></div>
    // tslint:disable-next-line:jsx-no-lambda
}} 
/>
//renderSectionBodyWrapper={(header, body) => <React.Fragment><div style={{ boxShadow: '0 0px 5px 2px #ccc' }}>{header}{body}</div></React.Fragment>}