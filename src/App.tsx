import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HasAuth } from './auth';
import { Login } from './pages/login';
import { Pokedex } from './pages/pokedex';

const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app/',
  cache: new InMemoryCache(),
});

function App() {
  const [hasAuth, setAuth] = React.useState(false);
  return (
    <ApolloProvider client={client}>
      <HasAuth.Provider value={[hasAuth, setAuth]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Pokedex />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </HasAuth.Provider>
    </ApolloProvider>
  );
}

export default App;
