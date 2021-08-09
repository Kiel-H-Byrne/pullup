import React from "react";
import { useFormik } from "formik";
import { mutate } from "swr";
import axios from "axios";
import { PullUp } from "../types";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, Center, CircularProgress, Flex, Text, Textarea } from "@chakra-ui/react";
import { signin, useSession } from "next-auth/client";
import { getTruncated } from "../util/helpers";
import VideoRecorder from 'react-video-recorder'
import { useState } from "react";

interface Props {
  onClose: () => void;
  locationData: any;
  uid: string;
  userName: string;
}

const onRecFinish = (videoBlob: string) => {
  console.log('videoBlob', videoBlob)
}

export const PullUpForm = ({ onClose, locationData, uid, userName }: Props) => {
  const [session, loading] = useSession();
  const [allowRecord, setAllowRecord ]   = useState(false)
  const formik = useFormik({
    initialValues: {
      message: "",
    } as any,
    validate: async (values: PullUp) => {
      const errors: any = {};
      if (values.message.length < 5) {
        errors.message = "Let's say a bit more...";
      }
      if (values.message.length == 0) {
        errors.message = "Cannot be blank";
      }
      return errors;
    },
    onSubmit: async (values, helpers) => {
      //get geoPoint, place on map with message metadata
      //show x or check, if wrong, get accurate point. if right, show modal
      //load modal w/ form
      //on form submit, place pin on map, pan to new pin, wait, pan back to user's location

      const apiUri = `api/pullups?lat=${getTruncated(
        locationData.coords.latitude
      )}&lng=${getTruncated(locationData.coords.longitude)}`;
      helpers.setSubmitting(true);
      const submit_data = {
        ...values,
        userName,
        uid,
        location: {
          lng: locationData.coords.longitude,
          lat: locationData.coords.latitude,
        },
        timestamp: new Date(locationData.timestamp),
      };
      mutate(apiUri, submit_data, false); //should i put mutate here or after the post with no options.
      console.log(submit_data)
      mutate(
        apiUri,
        await axios.post(apiUri, {
          data: submit_data,
        })
      );
      helpers.setSubmitting(false);
      helpers.resetForm({});
      helpers.setStatus({ success: true });
      onClose();
    },
  });

  return (
    <Box marginInline="3">
      {!formik.isSubmitting ? (
        <form onSubmit={formik.handleSubmit}>
          <Accordion defaultIndex={[0]} allowMultiple>
            <AccordionItem>
              <AccordionButton textAlign="center">
                <Flex m={"0 auto"}>COMMENT</Flex>
              </AccordionButton>
              <AccordionPanel>

                <Textarea
                  rows={2}
                  id="message"
                  name="message"
                  onChange={formik.handleChange}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton onClick={() => { setAllowRecord(true) }}>
                <Flex m={"0 auto"} >RECORD</Flex>
              </AccordionButton>
              <AccordionPanel>

                {allowRecord && <VideoRecorder
                  onRecordingComplete={onRecFinish} isOnInitially countdownTime={0}
                  />}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          {formik.errors ? (
            <Text as="p" color="red" textAlign="center">
              {formik.errors.message}
            </Text>
          ) : null}

          {session ? (
            <Button type="submit">Post</Button>
          ) : (
            <Button onClick={() => signin()}>Login to Pull Up!</Button>
          )}
        </form>
      ) : (
        <CircularProgress isIndeterminate />
      )}
    </Box>
  );
};

/**
 * <VideoRecorder
 chunkSize={250}
  constraints={{
    audio: true,
    video: true
  }}
  countdownTime={3000}
  dataAvailableTimeout={500}
  isFlipped
  isOnInitially
  mimeType={undefined}
  onError={function noRefCheck(){}}
  onOpenVideoInput={function noRefCheck(){}}
  onRecordingComplete={function noRefCheck(){}}
  onStartRecording={function noRefCheck(){}}
  onStopRecording={function noRefCheck(){}}
  onStopReplaying={function noRefCheck(){}}
  onTurnOffCamera={function noRefCheck(){}}
  onTurnOnCamera={function noRefCheck(){}}
  renderActions={function noRefCheck(){}}
  renderDisconnectedView={function noRefCheck(){}}
  renderErrorView={function noRefCheck(){}}
  renderLoadingView={function noRefCheck(){}}
  renderUnsupportedView={function noRefCheck(){}}
  renderVideoInputView={function noRefCheck(){}}
  t={function noRefCheck(){}}
  timeLimit={undefined}
 */