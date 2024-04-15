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
        <MeterGauge value={totalEffectiveness / meetingResponses.length || 0} />
      </Flex>
      <SimpleGrid
        flex={1}
        overflow={"auto"}
        padding={6}
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
      >
        {(meetings || []).map((meeting) => (
          <Card key={meeting.id} background="rgb(218 252 250)" maxHeight="200px">
            <CardHeader flex={1}>
              <Heading size="md">{meeting.title}</Heading>
            </CardHeader>
            <CardFooter justifyContent={"flex-end"}>
              <Link href={`/meeting/${meeting.id}`}>
                <Button
                  colorScheme="teal"
                  rightIcon={<MdPieChart />}
                  variant="outline"
                >
                  Analysis
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default MeetingPage;
