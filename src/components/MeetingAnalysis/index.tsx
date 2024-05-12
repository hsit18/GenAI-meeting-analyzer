//@ts-nocheck

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  StatGroup,
  Heading,
  OrderedList,
  ListItem,
  HStack,
  TagLabel,
  Tag,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link
} from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { TopicStats } from "./TopicStats";
import { MeetingEffectiveness } from "./Effectiveness";
import { TopicChart } from "./TopicChart";
import { Summary } from "./components/Summary";
import { askModel } from "@/utils/apiUtils";
import { SiMicrosoftteams } from "react-icons/si";
import { IoLogoLinkedin } from "react-icons/io";
import { GrMailOption } from "react-icons/gr";
import { SiWhatsapp } from "react-icons/si";
import { StatBox } from "../shared/StatBox";
import { ModelSelector } from "./components/ModelSelector";
import { GPT_MODELS } from "@/constants";

const CUT_OFF = 40;

export const MeetingAnalysis = ({ meeting }: { meeting: any }) => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(GPT_MODELS[0]);

  const getAllStats = useCallback(async () => {
    const percentages = await askModel(
      {
        id: meeting.id,
        model: selectedModel,
        query: "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
        responseKey: "response4",
        format: "json_object"
      }
    );

    console.log({
      percentages: (JSON.parse(percentages) || "").topics,
    });
    setData({
      ...data,
      percentages: JSON.parse(percentages || {}).topics,
    });
    setIsLoading(false);
  }, [selectedModel]);

  const getParticipants = useMemo(() => {
    if (data?.percentages?.length > 0) {
      let participantNames = [];
      (data?.percentages || []).forEach((obj) => {
        participantNames = participantNames.concat(
          Object.keys(obj.participants || {})
        );
      });
      return [...new Set(participantNames)];
    }
    return [];
  }, [data?.percentages]);

  const getTopicPercent = useMemo(() => {
    if (data?.percentages?.length > 0) {
      const topicStats = {};
      (data?.percentages || []).forEach((p) => {
        topicStats[p.topic] = Object.values(p.participants).reduce(
          (acc, curr) => acc + curr,
          0
        );
      });
      const totalPercent = Object.values(topicStats).reduce(
        (acc, curr) => acc + curr,
        0
      );
      Object.keys(topicStats).forEach(
        (t) =>
          (topicStats[t] = Math.round((topicStats[t] / totalPercent) * 100))
      );
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
    setIsLoading(true);
    setData({});
    getAllStats();
  }, [getAllStats, selectedModel]);

  return (
    <>
      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        zIndex={-1}
        mx={2}
        my={3}
      >
        <Heading as="h1" size="md" noOfLines={1}>
          {meeting.title}
        </Heading>
        <ModelSelector selected={selectedModel} onChange={setSelectedModel} />
      </HStack>

      <HStack
        justifyContent="space-between"
        alignItems="flex-start"
        height="110px"
        zIndex={-1}
      >
        <StatGroup justifyContent="flex-start">
          <StatBox loading={loading} label="Participants" value={getParticipants?.length || 0} />
          <StatBox loading={loading} label="Topics" value={Object.keys(getTopicPercent || {}).length || 0} />
          <StatBox loading={loading} label="Duration" value={`${meeting.duration || 0} mins`} />
        </StatGroup>
        <MeetingEffectiveness meetingId={meeting.id} model={selectedModel} />
      </HStack>

      <Tabs zIndex={999}>
        <TabList>
          <Tab>Summary</Tab>
          <Tab>Participants</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack maxWidth={"60%"} alignItems="flex-start" flex={1}>
                <Summary meetingId={meeting.id} model={selectedModel} />
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
                  <HStack spacing={4} alignItems={"flex-start"}>
                    <HStack>
                      <Text fontWeight="bold" minWidth="160px">{p}</Text>
                      <HStack justifyContent={"flex-start"} width="100%">
                        <Text>(</Text>
                        <Link
                          href={`mailto:akhandulokar@avaya.com?subject=You need to improvement on topics&body=Hi, \n you need improvement on these topics ${(getLearningTopics[p] || []).join(", ")}`}
                          isExternal
                        >
                          <GrMailOption
                            size={20}
                            color="#4285F4"
                            style={{
                              display: "inline",
                              verticalAlign: "bottom",
                            }}
                          />
                        </Link>
                        <Link
                          href={`https://web.whatsapp.com/send/?phone=919011040572&text=Hi you need improvement on these topics ${(getLearningTopics[p] || []).join(", ")}&type=phone_number&app_absent=0`}
                          isExternal
                        >
                          <SiWhatsapp
                            size={20}
                            color="#25D366"
                            style={{
                              display: "inline",
                              verticalAlign: "bottom",
                            }}
                          />
                        </Link>
                        <Link
                          href={`https://teams.microsoft.com/l/chat/0/0?users=akhandulokar@avaya.com&topicName=You need to improvement on topics&message=Hi you need improvement on these topics ${(getLearningTopics[p] || []).join(", ")}`}
                          isExternal
                        >
                          <SiMicrosoftteams
                            size={20}
                            color="#4E5FBF"
                            style={{
                              display: "inline",
                              verticalAlign: "bottom",
                            }}
                          />
                        </Link>
                        <Text>)</Text>
                      </HStack>
                    </HStack>
                    {(getLearningTopics[p] || []).map((topic) => (
                      <Tag
                        size="md"
                        key={topic}
                        borderRadius="full"
                        variant="solid"
                        color="black"
                        backgroundColor="#f5e2d6"
                        border="2px solid orange"
                      >
                        <TagLabel>
                          {topic}{" "}
                          <Link
                            href={`https://www.linkedin.com/learning/search?keywords=${topic}`}
                            isExternal
                          >
                            <IoLogoLinkedin
                              size={16}
                              color="#4E5FBF"
                              style={{
                                display: "inline",
                                verticalAlign: "bottom",
                              }}
                              mx="2px"
                            />
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
                        {p}
                        {"   "}
                        <Link
                          href="https://teams.microsoft.com/l/chat/0/0?users=akhandulokar@avaya.com"
                          isExternal
                        >
                          <SiMicrosoftteams
                            size={16}
                            color="#4E5FBF"
                            style={{
                              display: "inline",
                              verticalAlign: "bottom",
                            }}
                          />
                        </Link>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {(data.percentages || []).map((topicObj) => (
                    <Tr key={topicObj.topic}>
                      <Td>
                        {topicObj.topic}{" "}
                        <b>({getTopicPercent ? getTopicPercent[topicObj.topic] : 0}%)</b>
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
                              <IoLogoLinkedin
                                mx="2px"
                                size={16}
                                color="#0077B5"
                                style={{
                                  display: "inline",
                                  verticalAlign: "bottom",
                                }}
                              />
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
