"use client";
import Link from 'next/link';
import { MutualFund } from '@/types/MutualFund';
import { Card, CardHeader, CardBody, Heading, Stack, Box, StackDivider } from '@chakra-ui/react'

const MutualFundList = ({ data }: { data: MutualFund[] }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Mutual Funds</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          {data.map((d: MutualFund) => <Box key={d.schemeCode}>
            <Link href={`/mutualfund/${d.schemeCode}`}>
              <Heading size='xs' textTransform='uppercase'>
                {d.schemeCode} - {d.schemeName}
              </Heading>
            </Link>

          </Box>)}

        </Stack>
      </CardBody>
    </Card>
  );
}

export default MutualFundList;
