"use client";

import Image from "next/image";

import { useRef, useState } from "react";
import { MdCheck, MdTranscribe } from "react-icons/md";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const MeetingUpload = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [agenda, setAgenda] = useState("");
  const [transcribeFile, setTranscribeFile] = useState<File>();
  const [submiting, setSubmiting] = useState(false);

  const handleAgendaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgenda(event.target.value);
  };

  const handleTranscribeFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Assuming you want to store the uploaded file
    if (event.target.files === null) return;
    setTranscribeFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setSubmiting(true);
    const formData = new FormData();
    // Perform actions on form submission
    console.log("Agenda:", agenda);
    console.log("Transcribe File:", transcribeFile);
    // Add code to submit data to server or perform any other action
    formData.append("agenda", agenda);
    if (transcribeFile) {
      formData.append("transcribeFile", transcribeFile, transcribeFile.name);
    }

    await fetch("/api/meeting-upload", {
      method: "POST",
      body: formData,
    });
    setSubmiting(false);
    router.push('/meeting-details')
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <HStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      margin={4}
      align="stretch"
    >
      <Image src="/meeting.jpg" alt="Meeting" width={736} height={412} />
      <Box p={4} flex={1} minWidth={"500px"}>
        <VStack spacing={8} align="stretch">
          <FormControl id="agenda">
            <FormLabel>Meeting Agenda</FormLabel>
            <Input
              type="text"
              name="agenda"
              placeholder="Enter agenda"
              value={agenda}
              onChange={handleAgendaChange}
            />
          </FormControl>
          <FormControl id="transcribeUpload">
            <FormLabel>Upload Transcribe</FormLabel>
            <InputGroup onClick={handleClick}>
              <Input
                type="file"
                hidden
                ref={inputRef}
                variant="unstyled"
                accept=".txt,.doc,.docx"
                onChange={handleTranscribeFileChange}
              />
              <Button
                leftIcon={<Icon as={MdTranscribe} />}
                rightIcon={
                  transcribeFile?.name ? (
                    <Icon
                      as={MdCheck}
                      fill={"green"}
                      fontSize={20}
                      fontWeight="bold"
                    />
                  ) : undefined
                }
              >
                Upload
              </Button>
              <Text fontSize="md" m={2} fontStyle="italic">
                {transcribeFile?.name || ""}
              </Text>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            maxWidth={"300px"}
            isLoading={submiting}
            loadingText="Submitting"
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </HStack>
  );
};
