'use strict';
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');

var Html = React.createClass({
    mixins: [FluxibleMixin],

    render: function() {
        return (
            <html>
            <head>
                <meta charSet="utf-8"  />
                <title>{this.getStore(ApplicationStore).getPageTitle()}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="apple-touch-icon" sizes="57x57" href="/public/img/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/public/img/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/public/img/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/public/img/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/public/img/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/public/img/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/public/img/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/public/img/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/public/img/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192"  href="/public/img/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/public/img/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/public/img/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/public/img/favicon-16x16.png" />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content="/public/img/ms-icon-144x144.png" />
                <meta name="theme-color" content="#ffffff" />
				<link href="/public/css/main.min.css" rel="stylesheet" />
            </head>
            <body>
                <div context={this.props.context} id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/public/js/jquery.min.js"></script>
            <script src="/public/js/bootstrap.min.js"></script>
            <script src="/socket.io/socket.io.js"></script>
            <script src="/public/js/sockets.min.js"></script>
            <script src="/public/js/main.js"></script>
            </html>
        );
    }
});

module.exports = Html;
