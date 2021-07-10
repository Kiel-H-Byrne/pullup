import React, { ReactNode, useEffect, useRef } from "react";
import {Loader} from '@googlemaps/js-api-loader';
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import MyAvatar from "./MyAvatar";
import CustomHead from "./CustomHead";
import MyFooter from './MyFooter';

type Props = {
  children?: ReactNode;
  title?: string;
};

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/users", label: "Users" },
  { path: "/api/orders", label: "Orders" },
];
const mapCenter = { lat: -34.397, lng: 150.644 };


const Layout = ({ children, title }: Props) => {
  // const [show, setShow] = useState(true);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const googlemap = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.GOOGLE_API_KEY!,
      version: 'weekly',
    });
    let map;
    loader.load().then(() => {
      const google = (window as any).google;
      const mapOptions = {
        center: new google.maps.LatLng(mapCenter),
        zoom: 11,
        minZoom: 10,
        maxZoom: 14,
        // mapTypeId:google.maps.MapTypeId.TERRAIN,
        backgroundColor: "#555",
        clickableIcons: false,
        disableDefaultUI: true,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.RIGHT_CENTER,
            // mapTypeIds: ['roadmap', 'terrain']
        },
        scaleControl: false,
        rotateControl: true,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        //gestureHandling sets the mobile panning on a scrollable page: COOPERATIVE, GREEDY, AUTO, NONE
        gestureHandling: 'greedy',
        // Map styles; snippets from 'Snazzy Maps'.
        styles: 
            // lightGray 
            // [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#fefefe"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"color":"#b2b2b2"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#ff0000"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"color":"#696969"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#aaaaaa"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#b3b3b3"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#4f4f4f"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#6a6a6a"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#dbdbdb"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]}]
            // greyMonochrome
            [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
      }
      map = new google.maps.Map(googlemap.current, mapOptions);
    });
  });
  return (
    <>
      <CustomHead title={title || "Pull Up App"} />
      <div id="map" ref={googlemap} />
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <header>
          <Box display={{ base: "block", md: "none" }} onClick={onToggle}>
            <Button>{isOpen ? <CloseIcon /> : <HamburgerIcon />}</Button>
          </Box>

          <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">
                  Basic Drawer
                </DrawerHeader>
                <DrawerBody>
                  {NAV_LINKS.map(({ label, path }) => (
                    <Link key={label} href={path}>
                      <a>
                        <Box bg="blue.500">{label}</Box>
                      </a>
                    </Link>
                  ))}
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
          <Grid
            width="100%"
            templateColumns="repeat(4, 1fr)"
            gap={6}
            display={["none", "flex"]}
          >
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={label} href={path}>
                <a>
                  <Box bg="blue.500" padding="3" borderRadius="sm">
                    {label}
                  </Box>
                </a>
              </Link>
            ))}
            <Box position="absolute" right="0" paddingInline="3">
              <MyAvatar />
            </Box>
          </Grid>
        </header>
        {children}
      </div>
      <MyFooter />
    </>
  );
};

export default Layout;