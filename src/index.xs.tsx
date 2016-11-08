import * as React from "react";
import * as ReactDOM from "react-dom";

import "./style.md.scss";

class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return <a>XS</a>;
    }
}

ReactDOM.render(<App/>, document.getElementById("shouqianba"));

