import React from "react";
import { useFormik } from "formik";
import { mutate } from "swr";
import axios from "axios";
import { PullUp } from "../types";
import { Box, Button, CircularProgress, Text, Textarea } from "@chakra-ui/react";
import { signin, useSession } from "next-auth/client";

interface Props {
  onClose: () => void;
  locationData: any;
  uid: string;
  userName: string;
}

export const PullUpForm = ({ onClose, locationData, uid, userName }: Props) => {
  const [session, loading] = useSession();
  const formik = useFormik({
    initialValues: {
      uid,
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
      const getTruncated = (float: number) => Math.trunc(float);

      const apiUri = `api/pullups?lat=${getTruncated(
        locationData.coords.latitude
      )}&lng=${getTruncated(locationData.coords.longitude)}`;
      helpers.setSubmitting(true);
      const submit_data = {
        ...values,
        userName,
        uid,
        location: {
          lat: locationData.coords.latitude,
          lng: locationData.coords.longitude,
        },
        timestamp: new Date(locationData.timestamp),
      };
      mutate(apiUri, submit_data, false); //should i put mutate here or after the post with no options.
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
      {!formik.isSubmitting ? ( //if a user is logged in right??
        <form onSubmit={formik.handleSubmit}>
          <Textarea
            rows={2}
            id="message"
            name="message"
            onChange={formik.handleChange}
          />
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