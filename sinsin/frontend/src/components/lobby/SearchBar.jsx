import { useState } from 'react';
import styled from 'styled-components';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="방 제목으로 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <SearchButton type="submit">검색</SearchButton>
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SearchButton = styled.button`
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default SearchBar;