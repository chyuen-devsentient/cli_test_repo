import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { ThemeSwitcherProvider } from "react-css-theme-switcher";

const themes = {
  dark: `../../themes/dark-theme.css`,
  light: `../../themes/light-theme.css`,
};

console.log("Loading DevSentient");

const client = new ApolloClient({
  // uri: 'https://dev-d2vapi.k8s.devsentient.com/graphql',
  uri: `${import.meta.env.SNOWPACK_PUBLIC_REACT_APP_GQL_ENDPOINT}/graphql`,
  credentials: 'include'
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme="light">
        <App />
      </ThemeSwitcherProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
