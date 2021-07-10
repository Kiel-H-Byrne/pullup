import { Center } from '@chakra-ui/react'
import React from 'react'

interface Props {
  
}

const MyFooter = (props: Props) => {
  return (
    <footer style={{position: "absolute", bottom: 0}}>
      <Center fontSize={"xs"} {...props}>© Copyright TenK Solutions, LLC. All Rights Reserved</Center>
    </footer>
  );
}

export default MyFooter