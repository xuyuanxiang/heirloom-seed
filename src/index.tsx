import * as React from "react";
import * as ReactDOM from "react-dom";
class Test extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return <h1/>;
    }
}
const container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(<Test/>, container);
