'use strict';

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class Html extends React.Component {
    render() {
        let trackingCode = `
            <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-66294889-1', 'auto');
            ga('send', 'pageview');
            </script>
            `;
        
        return (
            <html>
            <head>
                <meta charSet="utf-8"  />
                <title>{this.props.context.getStore(ApplicationStore).pageTitle}</title>
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
                <meta name="description" content="A containerized continuous integration testing service built on Docker made for Github." />
				<link href="/public/css/main.min.css" rel="stylesheet" />
                <link rel="stylesheet" type="text/css" href="/public/css/sweetalert.css" />
            </head>
            <body>
                <div context={this.props.context} id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                <div dangerouslySetInnerHTML={{ __html: trackingCode }} />
            </body>
            <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
            <script src="/public/js/jquery.min.js"></script>
            <script src="/public/js/bootstrap.min.js"></script>
            <script src="/public/js/sweetalert.min.js"></script>
            <script src="/socket.io/socket.io.js"></script>
            <script src="/public/js/navbars.min.js"></script>
            <script src="/public/js/sockets.min.js"></script>
            <script src="/public/js/main.js"></script>
            </html>
        );
    }
}

export default Html;
