"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Sector,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Label,
    LabelList,
} from "recharts";
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Heading,
    Box,
    SkeletonCircle,
    Divider,
    SkeletonText,
    Card,
    CardBody,
    Stack,
    CardHeader,
    OrderedList,
    ListItem,
} from "@chakra-ui/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const ChatGPTComponent = () => {
    const [data, setData] = useState({});
    const [loading, setIsLoading] = useState(true);

    const askModel = async (query, format = "text") => {
        const res = await fetch(`/api/ask-model`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                format,
            }),
        });
        return await res.json();
    };

    const getAllStats = async () => {
        const summary = await askModel("Can you summarize the meeting.");
        const participants = await askModel(
            "Provide list of participants joined. Return output in raw JSON like {participants: ['participant1', 'participant2']} "
        );
        const percentages = await askModel(
            "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
            "json_object"
        );

        console.log({
            summary,
            participants: JSON.parse(participants || {}).participants,
            percentages: (JSON.parse(percentages) || {}).topics,
        });
        setData({
            ...data,
            summary,
            participants: JSON.parse(participants || {}).participants,
            percentages: JSON.parse(percentages || {}).topics,
        });
        setIsLoading(false);
    };

    const getChartData = (index) => {
        return Object.keys(data?.percentages[index]?.participants || {}).map(
            (name, index) => ({
                name,
                value: data?.percentages[index]?.participants[name] || 0,
            })
        );
    };

    const getTopics = () => {
        return (data?.percentages || []).map((topicObj) => topicObj.topic);
    };

    useEffect(() => {
        getAllStats();
    }, []);

    if (loading) {
        return (
            <Box padding="6" boxShadow="lg" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
            </Box>
        );
    }

    return (
        <Tabs>
            <TabList>
                <Tab>Summary</Tab>
                <Tab>Partcipants Statistics</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Heading as="h3" size="md" noOfLines={1} my={3}>
                        Summary
                    </Heading>
                    <p>{data?.summary || ""}</p>

                    <Heading as="h3" size="md" noOfLines={1} my={3}>
                        Topics discussed
                    </Heading>

                    <OrderedList>
                        {(getTopics() || []).map(t => <ListItem key={t}>{t}</ListItem>)}
                    </OrderedList>

                    <Heading as="h3" size="md" noOfLines={1} my={3}>
                        Participants
                    </Heading>
                    <OrderedList>
                        {(data.participants || []).map(p => <ListItem key={p}>{p}</ListItem>)}
                    </OrderedList>
                </TabPanel>
                <TabPanel>
                    {(data?.percentages || []).map((topicObj, index) => (
                        <Card
                            key={topicObj.topic}
                            direction="column"
                            overflow="hidden"
                            variant="outline"
                        >
                            <CardHeader>
                                <Heading as="h3" size="md" noOfLines={1}>
                                    {topicObj.topic || ""}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack direction="row" alignItems="center">
                                    <PieChart width={250} height={250}>
                                        <Pie
                                            dataKey="value"
                                            isAnimationActive={false}
                                            data={getChartData([index])}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}

                                            fill="#8884d8"
                                            label
                                        >
                                            {getChartData([index]).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => `${value}%`} />
                                    </PieChart>
                                    <Box mt={4}>
                                        <StatGroup>
                                            {Object.keys(topicObj.participants || {}).map((name) => (
                                                <Stat key={name} style={{ minWidth: '150px' }}>
                                                    <StatLabel>{(name || "").toUpperCase()}</StatLabel>
                                                    <StatHelpText>
                                                        <StatArrow
                                                            type={
                                                                (topicObj.participants[name] || 0) < 50
                                                                    ? "decrease"
                                                                    : "increase"
                                                            }
                                                        />
                                                        {topicObj.participants[name] || 0}%
                                                    </StatHelpText>
                                                </Stat>
                                            ))}
                                        </StatGroup>

                                    </Box>
                                </Stack>
                            </CardBody>
                        </Card>
                    ))}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
