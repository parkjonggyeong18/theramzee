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

<<<<<<< HEAD
const Container = styled.form`  // div에서 form으로 변경
=======
const Container = styled.form`
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
<<<<<<< HEAD
  padding: 5px;
=======
  padding: 10px;
  border: 1px solid #ccc;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  border-radius: 5px;
`;

const SearchButton = styled.button`
<<<<<<< HEAD
  padding: 5px 15px;
  background: #90EE90;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #98FB98;
  }
=======
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default SearchBar;