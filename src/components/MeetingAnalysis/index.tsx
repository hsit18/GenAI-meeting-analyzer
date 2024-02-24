"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatHelpText,
  StatArrow,
  StatGroup,
  SkeletonText,
  Heading,
  Box,
  Card,
  CardBody,
  Stack,
  CardHeader,
  OrderedList,
  ListItem,
  HStack,
  TagLabel,
  Tag,
  Text,
  VStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  StatNumber,
  Container,
  SimpleGrid,
  Link,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { TopicStats } from "./TopicStats";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#38812F",
];

const CUT_OFF = 40;

export const MeetingAnalysis = ({ agenda }: { agenda: string }) => {
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
    const effectiveness = await askModel(
      "Can you analyse meeting transcribe and provide overall effectiveness only in raw JSON like {effectiveness: 50}."
    );
    const response = await askModel(
      `
        Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. 
        Can you analyse meeting transcribe and provide overall effectiveness?

        Respond only in JSON that satisfies the Response type:

        type Response = {
            topics: Topic[];
            effectiveness: number;
            summary: string;
        };

        type Topic = {
            name: string;
            participants: Participant[]
        }

        type Participant = {
            name: string,
            percentage: number
        }
      `,
      "json_object"
    );
    const percentages = await askModel(
      "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
      "json_object"
    );

    console.log({
      summary,
      response,
      effectiveness: JSON.parse(effectiveness || {}).effectiveness,
      percentages: (JSON.parse(percentages) || {}).topics,
    });
    setData({
      ...data,
      summary,
      response,
      effectiveness: JSON.parse(effectiveness || {}).effectiveness,
      percentages: JSON.parse(percentages || {}).topics,
    });
    setIsLoading(false);
  };

  const getChartData = (participants) => {
    return Object.keys(participants || {}).map((name, index) => ({
      name,
      value: participants[name] || 0,
    }));
  };

  const getTopics = () => {
    return (data?.percentages || []).map((topicObj) => topicObj.topic);
  };

  const getParticipants = useMemo(() => {
    const learning = {};
    if (data?.percentages?.length > 0) {
      return Object.keys(data?.percentages[0].participants || [0]);
    }
    return [];
  }, [data?.percentages]);

  const getLearningTopics = useMemo(() => {
    const learning = {};
    (data?.percentages || []).forEach((topicObj, index) => {
      Object.keys(topicObj.participants || {}).forEach((name) => {
        if (topicObj.participants[name] < CUT_OFF) {
          learning[name] = learning[name]?.length ? learning[name] : [];
          learning[name].push(topicObj.topic);
        }
      });
    });
    return learning;
  }, [data?.percentages]);

  const getEffectivenessData = () => {
    const value = data.effectiveness || 0;
    return [
      { name: "Positive", value: value },
      { name: "Group B", value: 100 - value },
    ];
  };

  useEffect(() => {
    getAllStats();
  }, []);

  if (loading) {
    return (
      <Box padding="8" boxShadow="xlg" bg="white">
        <Heading as="h2" size="md" mb={2}>
          Analysing meeting using generative AI ....
        </Heading>
        <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }

  return (
    <>
      <Heading as="h1" size="xl" mx={2} noOfLines={1} my={3}>
        {agenda}
      </Heading>
      <Tabs>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Partcipants Statistics</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack maxWidth={"70%"} alignItems="flex-start">
                <Heading as="h3" size="md" noOfLines={1} my={3}>
                  Summary
                </Heading>
                <Text>{data?.summary || ""}</Text>
              </VStack>
              <VStack>
                <Heading as="h3" size="md" noOfLines={1} my={3}>
                  Effectiveness
                </Heading>
                <PieChart width={300} height={180}>
                  <Pie
                    data={getEffectivenessData() || []}
                    cx={140}
                    cy={150}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={100}
                    outerRadius={140}
                    fill="#FF8042"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key={`cell-1`} fill="#00C49F" />
                    <Cell key={`cell-2`} fill="#FF8042" />
                    <Tooltip />
                    <Label
                      value={`${data.effectiveness || 0}%`}
                      offset={0}
                      position="center"
                    />
                  </Pie>
                </PieChart>
              </VStack>
            </HStack>
            <Heading as="h3" size="md" noOfLines={1} my={3}>
              Participants need improvements
            </Heading>
            <OrderedList spacing={4}>
              {Object.keys(getLearningTopics || {}).map((p) => (
                <ListItem key={p}>
                  <HStack spacing={4}>
                    <Text>{p}</Text>
                    {(getLearningTopics[p] || []).map((topic) => (
                      <Tag
                        size="md"
                        key={topic}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="orange"
                      >
                        <TagLabel>{topic}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </ListItem>
              ))}
            </OrderedList>

            <TableContainer>
              <Table variant="unstyled">
                <Thead>
                  <Tr>
                    <Th>Topic</Th>
                    {(getParticipants || []).map(p => (
                      <Th>{p}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {(data.percentages || []).map(topicObj => (
                    <Tr key={topicObj.topic}>
                      <Td>{topicObj.topic}</Td>
                      {(getParticipants || []).map(p => (
                        <Td key={p}>
                          {(topicObj.participants[p] || 0) < CUT_OFF ? (<ArrowDownIcon color="red" />) : (<ArrowUpIcon color="green" />)}
                          {(topicObj.participants[p] || 0)}%
                          &nbsp; {(topicObj.participants[p] || 0) < CUT_OFF && <Link href='https://linkedin.com' isExternal>
                            <ExternalLinkIcon mx='2px' />
                          </Link>}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <TopicStats data={(data?.percentages || [])} partcipants={getParticipants || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
