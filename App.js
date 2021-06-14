/* eslint-disable radix */
/* eslint-disable no-const-assign */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.00005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyADLJmlQhEV2kUFlIaMToOx1UEEkuQ7dsY';

const App = ({route, navigation: {navigate, goBack}}) => {
  const mapView = useRef();
  const refRBSheet = useRef();

  const [coordinates, setCoordinates] = useState([
    {
      latitude: parseFloat(route?.params?.position.latitude),
      longitude: parseFloat(route?.params?.position.longitude),
      latitudeDelta: 0.007,
      longitudeDelta: 0.007,
    },
    {
      latitude: parseFloat(route?.params?.position.latitude),
      longitude: parseFloat(route?.params?.position.longitude),
      latitudeDelta: 0.007,
      longitudeDelta: 0.007,
    },
  ]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapView} // eslint-disable-line react/jsx-no-bind
        style={{...StyleSheet.absoluteFillObject}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={{
          latitude: parseFloat(route?.params?.position.latitude),
          longitude: parseFloat(route?.params?.position.longitude),
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}>
        <MapViewDirections
          origin={coordinates[0]}
          destination={coordinates[coordinates.length - 1]}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          mode="DRIVING"
          onReady={result => {
            console.log(`routing complete, distance is: ${result.distance}`);
            mapView.current.fitToCoordinates(result.coordinates, {
              animated: true,
            });
          }}
          onError={errorMessage => {
            console.log('GOT AN ERROR');
          }}
          resetOnChange={false}
          language="en"
          strokeColor={'lightBlue'}>
          <Marker
            coordinate={coordinates[0]}
            title={'Origin'}
            identifier={'origin'}
          />
          <Marker
            coordinate={coordinates[coordinates.length - 1]}
            title={'Destination'}
            identifier={'destination'}
          />
        </MapViewDirections>
      </MapView>
      <StatusBar backgroundColor={'lightBlue'} barStyle="light-content" />
      <View>
        <Text>Enter Destination</Text>
      </View>

      <View style={styles.destinationContainer}>
        <View style={styles.location}>
          <GooglePlacesAutocomplete
            placeholder="WHERE ARE YOU?"
            minLength={2}
            onPress={(data, details = null) => {
              console.log(data, details, 'my origin');
              const res = [];
              if (details.geometry && details.geometry.location) {
                res.push({
                  longitude: details?.geometry?.location?.lng,
                  latitude: details?.geometry?.location?.lat,
                });
              }

              setCoordinates(res);
            }}
            placeholderTextColor="#707070"
            styles={{
              textInput: styles.textInput,
              textInputContainer: styles.textInputContainer,
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
            }}
            suppressDefaultStyles
            enablePoweredByContainer={false}
            currentLocation={true}
            currentLocationLabel="Current Location"
          />
        </View>
        <View style={styles.location}>
          <GooglePlacesAutocomplete
            onPress={(data, details) => {
              console.log(details, data, 'my destination');
              const res = [];
              if (details.geometry && details.geometry.location) {
                res.push({
                  longitude: details?.geometry?.location?.lng,
                  latitude: details?.geometry?.location?.lat,
                });
              }
              setCoordinates([
                ...coordinates,
                {
                  longitude: details?.geometry?.location?.lng,
                  latitude: details?.geometry?.location?.lat,
                },
              ]);
              setTimeout(() => refRBSheet.current.open(), 5000);
            }}
            minLength={2}
            debounce={200}
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3',
            ]}
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
              rankby: 'distance',
              type: 'cafe',
            }}
            GooglePlacesDetailsQuery={{
              fields: 'formatted_address,geometry',
            }}
            fetchDetails
            suppressDefaultStyles
            renderDescription={row => row.description}
            placeholder="WHERE ARE YOU GOING?"
            styles={{
              textInput: styles.textInput,
              textInputContainer: styles.textInputContainer,
            }}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  destinationContainer: {
    width: width,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  location: {
    flexDirection: 'row',
    left: 20,
  },
  locationIcon: {
    height: 20,
    width: 20,
    top: 7,
  },

  textInputContainer: {
    width: 305,
  },
  textInput: {
    left: 20,
    bottom: 7,
    height: 50,
    marginBottom: 10,
    fontSize: 17,
    borderRadius: 10,
    paddingLeft: 10,
    fontFamily: 'Chromatica-Regular',
    color: '#858585',
    backgroundColor: 'grey',
  },
  separator: {
    backgroundColor: '#efefef',
    height: 1,
  },
  listView: {
    position: 'absolute',
    top: 50,
  },
  requestRideSheet: {
    justifyContent: 'center',
  },
  requestRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
  },
  requestFooter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestBody: {
    flexDirection: 'row',
    marginHorizontal: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  requestButton: {
    height: 50,
    backgroundColor: 'lightblue',
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  sheetIcon: {
    width: 65,
    height: 55,
  },
  icon: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconText: {
    fontSize: 16,
    textAlign: 'center',
    paddingTop: 10,
    fontFamily: 'Chromatica-Medium',
    color: '#858585',
  },
  requestButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Chromatica-Bold',
  },
});
export default App;
