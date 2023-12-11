import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  Modal,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  FlatList,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import {BlurView} from '@react-native-community/blur';
import {useSelector} from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import RNCalendarEvents from 'react-native-calendar-events';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import strings from '../../utils/strings';
import {useDispatch} from 'react-redux';
import {saveEvent, setCalendarPermission} from '../../redux/actions';
import colors from '../../utils/colors';
import moment from 'moment';
import DropShadow from 'react-native-drop-shadow';

var getIdeas = [];

const Home = props => {
  const dispatch = useDispatch();
  const {calendarPermission} = useSelector(state => state.userReducer);
  const menuArray = [
    {
      icon: require('../../assets/images/calendar.png'),
      title: strings?.savedIdeas,
      navigateTo: 'Events',
    },
    {
      icon: require('../../assets/images/github.png'),
      title: strings?.gitHub,
      navigateTo: 'https://github.com/DevVibhor/get-ideas',
    },
  ];
  const [apiResponse, setAPIResponse] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [permissionAccess, setPermissionAccess] = useState(false);
  const [eventTitle, setEventTitle] = React.useState('');

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const apiMethod = async () => {
    try {
      const response = await fetch('https://www.boredapi.com/api/activity/');
      const json = await response.json();
      getIdeas.push(json.activity);
      setAPIResponse(getIdeas);
      setShowLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalVisibility = index => {
    setModalVisible(true);
    setEventTitle(apiResponse[index]);
  };

  const RowContainer = (item, index) => {
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            item?.navigateTo === 'Events'
              ? (props?.navigation?.navigate('Events'), setMenuVisible(false))
              : Linking?.openURL(item?.navigateTo)
          }
          style={styles.rowContainerMain}>
          <View style={styles.mainMenuImage}>
            <Image
              resizeMode="contain"
              style={{width: 20, height: 20, justifyContent: 'center'}}
              source={item?.icon}
            />
          </View>
          <View style={styles.titleView}>
            <Text numberOfLines={1} style={styles.titleStyle}>
              {item?.title}
            </Text>
          </View>
        </TouchableOpacity>
        {index != 1 ? (
          <View style={[styles.lineDivider, {width: '80%'}]} />
        ) : null}
      </>
    );
  };

  useEffect(() => {
    let iterator = 0;
    while (iterator < 10) {
      apiMethod();
      iterator++;
    }
  }, []);

  const createEvent = () => {
    const newDate = new Date();
    const completionDate = new Date();
    completionDate.setHours(newDate.getHours() + 1);
    if (permissionAccess === false) {
      setPermissionAccess(false);
      RNCalendarEvents.saveEvent(eventTitle, {
        title: eventTitle,
        startDate: newDate.toISOString(),
        endDate: completionDate.toISOString(),
      })
        .then(value => {
          dispatch(
            saveEvent({
              eventID: value,
              eventTitle: eventTitle,
              startDate: newDate.toISOString(),
            }),
          );
          setModalVisible(false);
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              strings.toastConfirmation,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else {
            Alert.alert('Event saved', strings.toastConfirmation);
          }
        })
        .catch(error => {
          console.log('Error-createEvent: ', error);
        });
    } else {
      setPermissionAccess(true);
    }
  };

  const renderBGImages = () => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: -2,
        }}>
        <Image
          style={[
            styles?.bgImage,
            {
              transform: [{rotate: '45deg'}],
              top: '15%',
              left: '20%',
              opacity: 0.5,
            },
          ]}
          source={require('../../assets/images/lightbulb.png')}
        />

        <Image
          style={[
            styles?.bgImage,
            {
              top: '25%',
              right: '20%',
              opacity: 0.3,
            },
          ]}
          source={require('../../assets/images/stopwatch.png')}
        />

        <Image
          style={[
            styles?.bgImage,
            {
              bottom: '20%',
              right: '20%',
              opacity: 0.3,
            },
          ]}
          source={require('../../assets/images/rocket.png')}
        />

        <Image
          style={[
            styles?.bgImage,
            {
              bottom: '5%',
              left: '20%',
              opacity: 0.3,
            },
          ]}
          source={require('../../assets/images/target.png')}
        />
      </View>
    );
  };

  useEffect(() => {
    RNCalendarEvents.requestPermissions()
      .then(res => {
        dispatch(setCalendarPermission(res));
        if (res === 'authorized') {
          setPermissionAccess(false);
        } else {
          setPermissionAccess(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    if (Platform.OS === 'android') {
      setShow(true);
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {showLoader === true ? (
        <View style={styles.activityIndicatorStyle}>
          <ActivityIndicator
            animating={true}
            color={colors?.black}
            size="large"
          />
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.menuButtonContainer}
        onPress={() => setMenuVisible(true)}>
        <Image
          resizeMode="contain"
          style={styles.optionsStyle}
          source={require('../../assets/images/options.png')}
        />
      </TouchableOpacity>

      <View
        style={{
          justifyContent: 'center',
        }}>
        <Swiper
          infinite={true}
          cards={apiResponse}
          stackSeparation={2}
          keyExtractor={item => item}
          useViewOverflow={Platform.OS === 'ios'}
          renderCard={card => {
            return (
              <View style={styles.cardStyle}>
                <View style={styles.appNameContainer}>
                  <Text numberOfLines={1} style={styles.appNameStyle}>
                    {strings.appName} 🤔
                  </Text>
                </View>
                <Text style={styles.cardText}>{card}</Text>
              </View>
            );
          }}
          onSwiped={() => {
            apiMethod();
          }}
          onSwipedAll={() => {
            apiMethod();
          }}
          onTapCard={cardIndex => handleModalVisibility(cardIndex)}
          cardIndex={0}
          stackSize={3}
          swipeAnimationDuration={150}
        />
      </View>

      {renderBGImages()}
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{backgroundColor: 'red', flex: 1}} />
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        />

        <View style={styles.modalContainer}>
          <View style={styles.popupCard}>
            <View style={styles.calendarView}>
              <DropShadow style={styles?.dropShadowStyle}>
                <Image
                  resizeMode="contain"
                  style={styles.calendarImage}
                  source={require('../../assets/images/google-calendar.png')}
                />
              </DropShadow>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeImageButton}>
              <Image
                resizeMode="contain"
                style={styles.closeImage}
                source={require('../../assets/images/close.png')}
              />
            </TouchableOpacity>

            <Text style={styles.eventTitleStyle}>{eventTitle}</Text>
            <Text style={styles.dateTimeText}>{strings?.setCalendarDate}</Text>

            <View style={styles.calendarButtonContainer}>
              <TouchableOpacity
                disabled={permissionAccess === true ? true : false}
                onPress={() => showDatepicker()}
                style={[styles.buttonStyleDate, {marginRight: 20}]}>
                <Text style={styles.dateTimeStyle}>
                  {moment(date).format('MMM D, YYYY')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={permissionAccess === true ? true : false}
                onPress={() => showTimepicker()}
                style={styles.buttonStyleDate}>
                <Text style={styles.dateTimeStyle}>
                  {moment(date).format('h:mm A')}
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <RNDateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            )}
            {/* <RNDateTimePicker value={new Date()} display="default" />
            <RNDateTimePicker
              value={new Date()}
              display="default"
              mode="time"
            /> */}

            {permissionAccess === true ? (
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
            ) : null}

            <TouchableOpacity
              disabled={permissionAccess === true ? true : false}
              numberOfLines={1}
              onPress={() => createEvent()}
              style={
                permissionAccess === true
                  ? styles?.buttonStyleDisabled
                  : styles.buttonStyle
              }>
              <Text
                style={[
                  styles.saveButtonText,
                  {
                    color:
                      permissionAccess === true ? colors.black : colors.white,
                  },
                ]}>
                {strings.saveToCalendar}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType={'fade'}
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.popupMenu}>
          <View
            style={[
              styles.calendarView,
              {
                top: -70,
              },
            ]}>
            <DropShadow style={styles?.dropShadowStyle}>
              <Image
                resizeMode="contain"
                style={styles.iconView}
                source={require('../../assets/images/icon_without_bg.png')}
              />
            </DropShadow>
          </View>

          <TouchableOpacity
            onPress={() => setMenuVisible(false)}
            style={styles.closeImageButton}>
            <Image
              resizeMode="contain"
              style={styles.closeImage}
              source={require('../../assets/images/close.png')}
            />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.menuTitleStyle}>
            {strings.appName}
          </Text>

          <View style={styles.lineDivider} />

          <FlatList
            data={menuArray}
            renderItem={({item, index}) => RowContainer(item, index)}
            keyExtractor={(item, index) => 'key' + index}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
