"use client";
import {useState, useEffect} from 'react';
import { MutualFund } from '@/types/MutualFund';

import { Container, Input } from '@chakra-ui/react'
import MutualFundList from '../MutualFundList';

const SearchMutualFund = () => {
    const [value, setValue] = useState('');
    const [data, setData] = useState<MutualFund[]>([]);

    useEffect(() => {
        fetch(`https://api.mfapi.in/mf/search?q=${value}`).then(res => res.json()).then(res => {
            console.log(res);
            setData(res);
        });
    }, [value])
    return (
        <Container centerContent>
            <Input placeholder='Search Mutual funds' size='lg' value={value} onChange={(e) => setValue(e.target.value)} />
            <MutualFundList data={data} />
        </Container>

    )
}

export default SearchMutualFund;