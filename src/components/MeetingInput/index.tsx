"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MdTranscribe } from "react-icons/md";

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
  VStack,
} from "@chakra-ui/react";

export const MeetingInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [agenda, setAgenda] = useState("");
  const [transcribeFile, setTranscribeFile] = useState<File>();

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
    const formData = new FormData();
    // Perform actions on form submission
    console.log("Agenda:", agenda);
    console.log("Transcribe File:", transcribeFile);
    // Add code to submit data to server or perform any other action
    formData.append("otherData", agenda);
    if (transcribeFile) {
      formData.append("transcribeFile", transcribeFile, transcribeFile.name);
    }

    await fetch("/api/meeting-upload", {
      method: "POST",
      body: formData,
    });
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
              <Button leftIcon={<Icon as={MdTranscribe} />}>Upload</Button>
            </InputGroup>
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit} maxWidth={"300px"}>
            Submit
          </Button>
        </VStack>
      </Box>
    </HStack>
  );
};
