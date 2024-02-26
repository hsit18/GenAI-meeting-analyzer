//@ts-nocheck

"use client";

import { useEffect, useMemo, useState } from "react";
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
import { MeetingEffectiveness } from "./Effectiveness";

const CUT_OFF = 40;

export const MeetingAnalysis = ({ agenda }: { agenda: string }) => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(true);

  const askModel = async (query: string, format = "text") => {
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
    const topics = await askModel(
      "Can you analyse meeting transcribe and provide list of topics discussed with percentage on how close each topic is from meeting agenda. Return output in raw JSON like {topic1: 20, topic2: 50} "
    );
    const percentages = await askModel(
      "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
      "json_object"
    );

    console.log({
      summary,
      topics: JSON.parse(topics),
      effectiveness: JSON.parse(effectiveness || {}).effectiveness,
      percentages: (JSON.parse(percentages) || {}).topics,
    });
    setData({
      ...data,
      summary,
      topics: JSON.parse(topics),
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

  useEffect(() => {
    getAllStats();
  }, [getAllStats]);

  if (loading) {
    return (
      <Box padding="8" boxShadow="xlg" bg="white">
        <Heading as="h2" size="md" mb={2}>
          Analysing meeting: {agenda}
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
      <StatGroup justifyContent="flex-start">
        <Stat
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            textAlign: "center",
            flexGrow: 0,
            padding: "16px",
            margin: "8px 16px",
            minWidth: "150px",
          }}
        >
          <StatLabel>Participants</StatLabel>
          <StatNumber>{getParticipants?.length || 0}</StatNumber>
        </Stat>

        <Stat
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            textAlign: "center",
            flexGrow: 0,
            padding: "16px",
            margin: "8px 16px",
            minWidth: "150px",
          }}
        >
          <StatLabel>Topics</StatLabel>
          <StatNumber>{(data?.percentages || []).length || 0}</StatNumber>
        </Stat>
      </StatGroup>
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
                <MeetingEffectiveness value={data.effectiveness || 0} />
              </VStack>
            </HStack>
            <Heading as="h3" size="md" noOfLines={1} my={3}>
              Participants Topic Statistics
            </Heading>
            <TableContainer>
              <Table variant="unstyled">
                <Thead>
                  <Tr>
                    <Th>Topic Discussed</Th>
                    {(getParticipants || []).map((p) => (
                      <Th key={p}>
                        {p}{" "}
                        <Link
                          href="https://teams.microsoft.com/l/chat/0/0?users=vermaa@avaya.com"
                          isExternal
                        >
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {(data.percentages || []).map((topicObj) => (
                    <Tr key={topicObj.topic}>
                      <Td>{topicObj.topic} {data?.topics[topicObj.topic] || 0}%</Td>
                      {(getParticipants || []).map((p) => (
                        <Td key={p}>
                          {(topicObj.participants[p] || 0) < CUT_OFF ? (
                            <ArrowDownIcon color="red" />
                          ) : (
                            <ArrowUpIcon color="green" />
                          )}
                          {topicObj.participants[p] || 0}% &nbsp;{" "}
                          {(topicObj.participants[p] || 0) < CUT_OFF && (
                            <Link
                              href={`https://www.linkedin.com/learning/search?keywords=${topicObj.topic}`}
                              isExternal
                            >
                              <ExternalLinkIcon mx="2px" />
                            </Link>
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
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
          </TabPanel>
          <TabPanel>
            <TopicStats
              data={data?.percentages || []}
              partcipants={getParticipants || []}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
