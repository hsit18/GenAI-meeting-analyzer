import { MeterGauge } from "@/components/shared/MeterGauge";
import { StatBox } from "@/components/shared/StatBox";
import prisma from "@/lib/prisma";
import {
  Card,
  CardHeader,
  CardFooter,
  SimpleGrid,
  Heading,
  Button,
  Flex,
  CardBody,
} from "@chakra-ui/react";
import Link from "next/link";
import { MdUpload, MdPieChart } from "react-icons/md";

const MeetingPage = async () => {
  const meetings = await prisma.meeting.findMany({});
  const meetingResponses = await prisma.meeting_response.findMany({});
  const totalEffectiveness = meetingResponses.reduce(
    (acc, curr) => acc + (JSON.parse(curr.response2 || "").effectiveness || 0),
    0
  );
  const getEffectiveness = (meetingId: number) => {
    if(!meetingResponses?.length) return 0;
    const obj = meetingResponses.find((response) => response.meetingId === meetingId);
    if(!obj) return 0;
    return JSON.parse(obj?.response2 || "").effectiveness || 0;
  };

  return (
    <Flex padding={4} direction="column" overflow="auto" height="100%">
      <Flex justifyContent={"space-between"} padding={4}>
        <Heading size={"md"}>Meeting Dashboard </Heading>{" "}
        <Link href={`/meeting/upload`}>
          <Button leftIcon={<MdUpload />} colorScheme="teal">
            Upload Meeting
          </Button>
        </Link>
      </Flex>
      <Flex justifyContent={"space-between"} padding={4} height="150px">
        <StatBox loading={false} label="Total Meetings" value={meetings.length} />
        <div style={{alignSelf: "start"}}>
        <MeterGauge value={parseInt((totalEffectiveness / meetingResponses.length || 0).toString(), 10)} />
        </div>
      </Flex>
      <SimpleGrid
        flex={1}
        overflow={"auto"}
        padding={6}
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
      >
        {(meetings || []).map((meeting) => (
          <Link key={meeting.id} href={`/meeting/${meeting.id}`}>
          <Card background="rgb(218 252 250)" height="220px">
            <CardHeader>
              <Heading size="md">{meeting.title}</Heading>
            </CardHeader>
            <CardBody padding={0} height="100px">
              <MeterGauge value={getEffectiveness(meeting.id)} size="60%" />
            </CardBody>
          </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default MeetingPage;
