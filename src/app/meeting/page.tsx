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
  return (
    <>
      <Flex justifyContent={"space-between"} padding={4}>
        <Heading size={"md"}>Meeting Dashboard </Heading>{" "}
        <Link href={`/meeting/upload`}>
          <Button leftIcon={<MdUpload />} colorScheme="teal">Upload Meeting</Button>
        </Link>
      </Flex>

      <SimpleGrid
        padding={6}
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
      >
        {(meetings || []).map((meeting) => (
          <Card key={meeting.id} background="rgb(218 252 250)">
            <CardHeader>
              <Heading size="md">{meeting.title}</Heading>
            </CardHeader>
            <CardFooter justifyContent={"flex-end"}>
              <Link href={`/meeting/${meeting.id}`}>
                <Button colorScheme="teal" rightIcon={<MdPieChart />} variant='outline'>Meeting Analysis</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
};

export default MeetingPage;
