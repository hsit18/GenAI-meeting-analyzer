import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Text, Button } from '@chakra-ui/react'

export default function Home() {
  return (
    <main className="flex">
      <SimpleGrid padding={6} spacing={4} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
        <Card>
          <CardHeader>
            <Heading size='md'>Meetings App</Heading>
          </CardHeader>
          <CardBody>
            <Text>Analysis of team meeting based on AI.</Text>
          </CardBody>
          <CardFooter>
            <Link href="/meeting"><Button>Start here</Button></Link>
          </CardFooter>
        </Card>
      </SimpleGrid>
    </main>
  )
}
