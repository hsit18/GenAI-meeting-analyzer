

"use client";
import { Card, CardHeader, CardBody, Heading, Stack, Box, StackDivider, Text } from '@chakra-ui/react';
import { MutualFund } from '@/types/MutualFund';

const MutualFundSummary = ({ data }: { data: MutualFund }) => {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{`${data.meta.scheme_code} - ${data.meta.scheme_name}`}</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                            Fund House
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                            {data.meta.fund_house}
                        </Text>
                    </Box>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                            Type
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                            {data.meta.scheme_type}
                        </Text>
                    </Box>
                    <Box>
                        <Heading size='xs' textTransform='uppercase'>
                            Category
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                            {data.meta.scheme_category}
                        </Text>
                    </Box>
                </Stack>
            </CardBody>
        </Card >
    )
}

export default MutualFundSummary;
