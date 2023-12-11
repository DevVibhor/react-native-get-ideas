import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Platform,
  ToastAndroid,
  Alert,
  AppState,
  Linking,
} from 'react-native';
import strings from '../../utils/strings';
import styles from './styles';
import {useSelector} from 'react-redux';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import {useDispatch} from 'react-redux';
import {updateEvent} from '../../redux/actions';

const Events = props => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const {savedEvents, calendarPermission} = useSelector(
    state => state.userReducer,
  );
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const deleteEvent = eventId => {
    RNCalendarEvents.removeEvent(eventId).then(val => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          strings.reminderDeleted,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert('Event Removed', strings.reminderDeleted);
      }
      dispatch(updateEvent(eventId));
    });
  };

  const markAsComplete = eventId => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        strings.markAsDone,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      Alert.alert('Completed', strings.markAsDone);
    }
    dispatch(updateEvent(eventId));
  };

  const RenderStoreEvents = (item, index) => {
    let dateAndTime = `${moment(item?.startDate).format(
      'MMMM Do YYYY',
    )} | ${moment(item?.startDate).format('h:mm:ss a')}`;
    return (
      <View style={styles.cardContainer}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Text style={styles?.eventTitle}>{item?.eventTitle}</Text>
          <Text numberOfLines={1} style={styles?.eventDateTime}>
            {dateAndTime}
          </Text>
        </View>

        <View style={styles?.imageContainer}>
          <TouchableOpacity
            onPress={() => markAsComplete(item?.eventID)}
            style={styles?.tickContainer}>
            <Image
              style={styles?.tickIcon}
              resizeMode="contain"
              source={require('../../assets/images/check.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteEvent(item?.eventID)}
            style={styles?.deleteContainer}>
            <Image
              resizeMode="contain"
              style={styles?.tickIcon}
              source={require('../../assets/images/delete.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const fetchEvent = () => {
    savedEvents?.forEach(event => {
      RNCalendarEvents.findEventById(event?.eventID).then(data => {
        if (data === null) {
          dispatch(updateEvent(event?.eventID));
        }
      });
    });
  };

  useEffect(() => {
    if (appStateVisible === 'active') {
      fetchEvent();
    }
  }, [appStateVisible]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerStyle}>
        <Text numberOfLines={1} style={styles.titleStyle}>
          {strings?.savedIdeas}
        </Text>

        <TouchableOpacity
          style={{right: 25, padding: 5}}
          onPress={() => props?.navigation?.goBack()}>
          <Image
            resizeMode="contain"
            style={styles?.backButtonStyle}
            source={require('../../assets/images/back.png')}
          />
        </TouchableOpacity>
      </View>

      {calendarPermission === 'authorized' ? (
        <View style={{marginTop: 30}}>
          {savedEvents?.length > 0 ? (
            <FlatList
              data={savedEvents}
              renderItem={({item, index}) => RenderStoreEvents(item, index)}
            />
          ) : (
            <View style={styles?.noActiveContainer}>
              <Text style={styles?.noActiveEvents}>
                {strings?.noActiveEvent}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles?.permissionAccessView}>
          <Text style={styles?.deniedCalendarText}>
            {strings?.deniedCalendar}
          </Text>
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={styles?.goToSettingsText}>
              {strings?.goToSettings}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Events;
