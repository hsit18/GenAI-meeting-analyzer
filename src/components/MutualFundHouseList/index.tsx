"use client";
import Link from 'next/link';
import { MutualFund } from '@/types/MutualFund';
import { Card, CardHeader, CardBody, Heading, Stack, Box, StackDivider } from '@chakra-ui/react'

const MutualFundHouseList = ({ data }: { data: string[] }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Mutual Fund Houses</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          {data.map((d: string) => <Box key={d}>
            <Link href={`/mutual-fund/${d.toLowerCase().replace('mutual fund', '')}`}>
              <Heading size='xs' textTransform='uppercase'>
                {d}
              </Heading>
            </Link>

          </Box>)}

        </Stack>
      </CardBody>
    </Card>
  );
}

export default MutualFundHouseList;
