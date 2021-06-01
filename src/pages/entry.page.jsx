import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const Entry = () => {
    const [isGame, setGame] = useState(false);

    const query = useQuery();

    console.log('query', query.get('user'));
    console.log('query', query.get('room'));

    return <div>Entry page</div>;
};
export default Entry;
