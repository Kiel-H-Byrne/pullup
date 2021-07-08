import React from "react";
import Layout from "../components/Layout";
import {
  Box,
  Center,
  Flex,
  Heading,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import fetcher from "../util/fetch";
import useSWR from "swr";

const IndexPage = () => {
  return (
    <Layout title="Top5Plays.com">
      <Heading textAlign="center" margin="auto">
        Top 5 Plays 👋
      </Heading>
      <Box direction="column" padding="3" marginBlock="5">
        <Center fontWeight={400} fontSize={["2xl", "3xl", "4xl"]}>
          Welcome to This Weeks Plays!
        </Center>
        <Text fontWeight={300} fontSize={16}>
          The online "Investor Group Chat". Post your watchlist, watch the plays
          others are watching or making this week! See the trends play out right
          before your eyes.
        </Text>
      </Box>
    </Layout>
  );
};

export default IndexPage;