import React from "react";
import "./index.scss";
var __html = require('../../home/index.html.js');
var template = { __html: __html };

function Home() {
    return (
        <div dangerouslySetInnerHTML={template} />
        // <div>
        // <h2>Home page</h2>
        // </div>
    );
}

export default Home;