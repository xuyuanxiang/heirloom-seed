import * as React from "react";
import * as ReactDOM from "react-dom";
class Test extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): JSX.Element {
        return <a>test</a>;
    }
}
const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<Test/>, container);
