import { ChevronDownIcon } from "@chakra-ui/icons"
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import { GPT_MODELS, GROQ_MODELS } from "@/constants";
import React from "react";

export const ModelSelector = ({onChange, selected}: {onChange: React.Dispatch<React.SetStateAction<string>>, selected: string}) => {
    return (
        <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {selected || "Select Model"}
        </MenuButton>
        <MenuList zIndex={999999}>
            {[...GPT_MODELS, ...GROQ_MODELS].map(m => <MenuItem key={m} onClick={() => onChange(m)}>{m}</MenuItem>)}
        </MenuList>
      </Menu>
    )
}