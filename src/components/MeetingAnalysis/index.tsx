//@ts-nocheck

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { TopicStats } from "./TopicStats";
import { MeetingEffectiveness } from "./Effectiveness";
import { TopicChart } from "./TopicChart";
import { Summary } from "./components/Summary";
import { askModel } from "@/utils/apiUtils";

const CUT_OFF = 40;

export const MeetingAnalysis = ({ meeting }: { meeting: any }) => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(true);

  const getAllStats = useCallback(async () => {
    const percentages = await askModel(
      meeting.id,
      "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
      "response4",
      "json_object"
    );

    console.log({
      percentages: (JSON.parse(percentages) || "").topics,
    });
    setData({
      ...data, 
      percentages: JSON.parse(percentages || {}).topics,
    });
    setIsLoading(false);
  }, []);

  const getParticipants = useMemo(() => {
    if (data?.percentages?.length > 0) {
      let participantNames = [];
      (data?.percentages || []).forEach((obj) => {
        participantNames = participantNames.concat(Object.keys(obj.participants || {}));
      });
      return [...new Set(participantNames)];
    }
    return [];
  }, [data?.percentages]);

  const getTopicPercent = useMemo(() => {
    if (data?.percentages?.length > 0) {
      const topicStats = {};
      (data?.percentages || []).forEach(p => {
        topicStats[p.topic] = Object.values(p.participants).reduce((acc,curr)=>acc+curr,0)        
      });
      const totalPercent = Object.values(topicStats).reduce((acc,curr)=>acc+curr,0)
      Object.keys(topicStats).forEach(t=>topicStats[t] = Math.round((topicStats[t]/totalPercent)*100));
      return topicStats;
    }
    return {};
  }, [data?.percentages]);
  
  const getLearningTopics = useMemo(() => {
    const learning = {};
    const participants = getParticipants || [];
    (data?.percentages || []).forEach((topicObj, index) => {
      (participants || []).forEach((name) => {
        if ((topicObj.participants[name] || 0) < CUT_OFF) {
          learning[name] = learning[name]?.length ? learning[name] : [];
          learning[name].push(topicObj.topic);
        }
      });
    });
    return learning;
  }, [data?.percentages, getParticipants]);
  useEffect(() => {
    getAllStats();
  }, [getAllStats]);


  return (
    <>
      <Heading as="h1" size="xl" mx={2} noOfLines={1} my={3}>
        {meeting.title}
      </Heading>
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        height="110px"
        zIndex={-1}
      >
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
            <StatNumber>{loading ? <Spinner /> : (getParticipants?.length || 0)}</StatNumber>
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
            <StatNumber>{loading ? <Spinner /> : (Object.keys(getTopicPercent || {}).length || 0)}</StatNumber>
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
            <StatLabel>Duration</StatLabel>
            <StatNumber>{loading ? <Spinner /> : `${(Math.floor(Math.random() * 60) + 1)} mins`}</StatNumber>
          </Stat>
        </StatGroup>
        <MeetingEffectiveness meetingId={meeting.id} />
      </HStack>

      <Tabs zIndex={999}>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Partcipants Statistics</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack maxWidth={"70%"} alignItems="flex-start" flex={1}>
                <Heading as="h3" size="md" noOfLines={1} my={3}>
                  Summary
                </Heading>
                <Summary meetingId={meeting.id} />
              </VStack>
              <VStack>
                <TopicChart topics={getTopicPercent || {}} />
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
                        <TagLabel>
                          {topic}{" "}
                          <Link
                            href={`https://www.linkedin.com/learning/search?keywords=${topic}`}
                            isExternal
                          >
                            <ExternalLinkIcon mx="2px" />
                          </Link>
                        </TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </ListItem>
              ))}
            </OrderedList>
          </TabPanel>
          <TabPanel>
            <Heading as="h3" size="md" noOfLines={1} my={3}>
              Participants Topic Statistics
            </Heading>
            <TopicStats
              data={data?.percentages || []}
              partcipants={getParticipants || []}
            />
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
                      <Td>
                        {topicObj.topic} {getTopicPercent ? getTopicPercent[topicObj.topic] : 0}%
                      </Td>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
